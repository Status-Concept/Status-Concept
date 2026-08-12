"""Generate lightweight, presentation-ready GLB approximations for the Lounge MVP.

The catalogue images are the visual reference. These are intentionally useful
web models rather than manufacturing/CAD files: they communicate silhouette,
proportion, materials and the product composition shown in the primary card.
"""

from pathlib import Path
import math

import bpy
from mathutils import Vector


PROJECT_ROOT = Path(__file__).resolve().parents[2]
MODEL_ROOT = PROJECT_ROOT / "public" / "models" / "lounge"
SOURCE_ROOT = PROJECT_ROOT / "3d-source" / "lounge"
POSTER_ROOT = PROJECT_ROOT / ".local-tools" / "rendered-posters"


def rgba(rgb, alpha=1.0):
    return (*rgb, alpha)


def make_material(name, color, roughness=0.5, metallic=0.0, texture=None):
    material = bpy.data.materials.new(name)
    material.diffuse_color = rgba(color)
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    shader = nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = rgba(color)
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Metallic"].default_value = metallic

    if texture:
        noise = nodes.new("ShaderNodeTexNoise")
        noise.inputs["Scale"].default_value = texture.get("scale", 10.0)
        noise.inputs["Detail"].default_value = texture.get("detail", 2.0)
        noise.inputs["Roughness"].default_value = texture.get("roughness", 0.6)
        bump = nodes.new("ShaderNodeBump")
        bump.inputs["Strength"].default_value = texture.get("bump", 0.12)
        bump.inputs["Distance"].default_value = texture.get("distance", 0.08)
        links.new(noise.outputs["Fac"], bump.inputs["Height"])
        links.new(bump.outputs["Normal"], shader.inputs["Normal"])

    return material


def build_materials():
    return {
        "rattan_dark": make_material(
            "Rattan dark",
            (0.055, 0.041, 0.032),
            roughness=0.78,
            texture={"scale": 19.0, "detail": 3.0, "roughness": 0.7, "bump": 0.2, "distance": 0.04},
        ),
        "rattan_warm": make_material(
            "Rattan warm",
            (0.22, 0.12, 0.065),
            roughness=0.8,
            texture={"scale": 17.0, "detail": 3.0, "roughness": 0.65, "bump": 0.18, "distance": 0.04},
        ),
        "rattan_black": make_material(
            "Rattan black",
            (0.018, 0.016, 0.015),
            roughness=0.76,
            texture={"scale": 20.0, "detail": 2.5, "roughness": 0.7, "bump": 0.16, "distance": 0.035},
        ),
        "ivory_fabric": make_material(
            "Ivory outdoor fabric",
            (0.79, 0.75, 0.66),
            roughness=0.88,
            texture={"scale": 28.0, "detail": 2.0, "roughness": 0.5, "bump": 0.12, "distance": 0.025},
        ),
        "cream_fabric": make_material(
            "Cream outdoor fabric",
            (0.91, 0.87, 0.78),
            roughness=0.86,
            texture={"scale": 30.0, "detail": 2.0, "roughness": 0.5, "bump": 0.1, "distance": 0.025},
        ),
        "teal_fabric": make_material(
            "Ibiza teal fabric",
            (0.17, 0.43, 0.45),
            roughness=0.87,
            texture={"scale": 26.0, "detail": 2.0, "roughness": 0.5, "bump": 0.1, "distance": 0.025},
        ),
        "charcoal": make_material("Charcoal powder coat", (0.025, 0.028, 0.03), roughness=0.62, metallic=0.2),
        "wood": make_material(
            "Warm teak",
            (0.42, 0.21, 0.085),
            roughness=0.66,
            texture={"scale": 4.0, "detail": 3.0, "roughness": 0.7, "bump": 0.1, "distance": 0.07},
        ),
        "bronze": make_material("Bronze detail", (0.35, 0.18, 0.055), roughness=0.42, metallic=0.7),
        "glass": make_material("Smoked glass", (0.06, 0.075, 0.08), roughness=0.16, metallic=0.1),
    }


def apply_material(obj, material):
    if obj.data and hasattr(obj.data, "materials"):
        obj.data.materials.append(material)
    return obj


def smooth_mesh(obj):
    if obj.type == "MESH":
        for polygon in obj.data.polygons:
            polygon.use_smooth = True


def add_bevel(obj, width=0.05, segments=3):
    if width <= 0:
        return obj
    modifier = obj.modifiers.new(name="Soft edges", type="BEVEL")
    modifier.width = width
    modifier.segments = segments
    modifier.limit_method = "ANGLE"
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    try:
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    finally:
        obj.select_set(False)
    return obj


def add_cube(name, location, size, material, bevel=0.0, rotation=(0.0, 0.0, 0.0)):
    bpy.ops.mesh.primitive_cube_add(location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    apply_material(obj, material)
    add_bevel(obj, bevel)
    return obj


def add_cylinder(name, location, radius, depth, material, vertices=64, bevel=0.0, rotation=(0.0, 0.0, 0.0)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    apply_material(obj, material)
    add_bevel(obj, bevel)
    smooth_mesh(obj)
    return obj


def add_cone(name, location, radius1, radius2, depth, material, vertices=64, bevel=0.0, rotation=(0.0, 0.0, 0.0)):
    bpy.ops.mesh.primitive_cone_add(
        vertices=vertices,
        radius1=radius1,
        radius2=radius2,
        depth=depth,
        location=location,
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    apply_material(obj, material)
    add_bevel(obj, bevel)
    smooth_mesh(obj)
    return obj


def add_uv_sphere(name, location, scale, material, segments=64, rings=32):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    apply_material(obj, material)
    smooth_mesh(obj)
    return obj


def add_torus(name, location, major_radius, minor_radius, material, rotation=(0.0, 0.0, 0.0), major_segments=64):
    bpy.ops.mesh.primitive_torus_add(
        major_segments=major_segments,
        minor_segments=16,
        location=location,
        major_radius=major_radius,
        minor_radius=minor_radius,
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    apply_material(obj, material)
    smooth_mesh(obj)
    return obj


def add_curve(name, points, radius, material):
    curve = bpy.data.curves.new(name, type="CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = 16
    curve.bevel_depth = radius
    curve.bevel_resolution = 4
    spline = curve.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for point, coordinate in zip(spline.bezier_points, points):
        point.co = coordinate
        point.handle_left_type = "AUTO"
        point.handle_right_type = "AUTO"
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    apply_material(obj, material)
    return obj


def add_leg(name, location, material, length=0.55, radius=0.045, tilt=(0.0, 0.0, 0.0)):
    return add_cone(name, location, radius1=radius, radius2=radius * 0.72, depth=length, material=material, vertices=32, bevel=0.01, rotation=tilt)


def add_rattan_ribs(name_prefix, x_values, location_y, z_start, z_end, material, radius=0.013):
    for index, x in enumerate(x_values):
        add_curve(
            f"{name_prefix} rib {index + 1}",
            [(x, location_y, z_start), (x, location_y, (z_start + z_end) / 2), (x, location_y, z_end)],
            radius,
            material,
        )


def build_barcelona(m):
    add_cylinder("Barcelona tabletop", (0, 0, 0.98), 1.05, 0.10, m["charcoal"], bevel=0.025)
    add_cylinder("Barcelona tabletop bronze rim", (0, 0, 0.925), 1.045, 0.035, m["bronze"], bevel=0.01)
    add_cylinder("Barcelona pedestal stem", (0, 0, 0.56), 0.14, 0.67, m["charcoal"], bevel=0.02)
    add_cone("Barcelona pedestal flare", (0, 0, 0.22), 0.39, 0.17, 0.18, m["charcoal"], bevel=0.025)
    add_cylinder("Barcelona base accent", (0, 0, 0.115), 0.43, 0.045, m["bronze"], bevel=0.012)
    add_cylinder("Barcelona base", (0, 0, 0.075), 0.38, 0.07, m["charcoal"], bevel=0.02)


def build_bonaire(m):
    add_cube("Bonaire rattan base", (0, 0, 0.46), (2.65, 0.94, 0.24), m["rattan_dark"], bevel=0.10)
    add_cube("Bonaire rattan back", (0, 0.38, 1.04), (2.60, 0.18, 1.22), m["rattan_dark"], bevel=0.09)
    add_cube("Bonaire left arm", (-1.18, 0.02, 0.92), (0.22, 0.88, 1.10), m["rattan_dark"], bevel=0.08)
    add_cube("Bonaire right arm", (1.18, 0.02, 0.92), (0.22, 0.88, 1.10), m["rattan_dark"], bevel=0.08)
    add_cube("Bonaire seat cushion", (0, -0.04, 0.72), (2.18, 0.70, 0.18), m["ivory_fabric"], bevel=0.11)
    for index, x in enumerate((-0.73, 0, 0.73)):
        add_cube(f"Bonaire back cushion {index + 1}", (x, 0.255, 1.22), (0.68, 0.14, 0.70), m["cream_fabric"], bevel=0.08)
    add_rattan_ribs("Bonaire back", (-1.08, -0.75, -0.42, -0.1, 0.25, 0.6, 0.95, 1.1), 0.475, 0.56, 1.53, m["rattan_warm"], radius=0.012)


def build_hawaii(m):
    add_cube("Hawaii table top", (0, 0, 0.86), (2.20, 1.06, 0.13), m["charcoal"], bevel=0.065)
    add_cube("Hawaii table underside", (0, 0, 0.78), (1.98, 0.88, 0.08), m["rattan_black"], bevel=0.035)
    for index, (x, y, tilt) in enumerate((
        (-0.82, -0.35, (0.11, -0.12, 0)),
        (0.82, -0.35, (0.11, 0.12, 0)),
        (-0.82, 0.35, (-0.11, -0.12, 0)),
        (0.82, 0.35, (-0.11, 0.12, 0)),
    )):
        add_leg(f"Hawaii leg {index + 1}", (x, y, 0.42), m["charcoal"], length=0.68, radius=0.05, tilt=tilt)


def build_ibiza(m):
    add_cube("Ibiza teak platform", (0, 0, 0.42), (1.02, 0.88, 0.16), m["wood"], bevel=0.05)
    for index, (x, y) in enumerate(((-0.38, -0.31), (0.38, -0.31), (-0.38, 0.31), (0.38, 0.31))):
        add_leg(f"Ibiza teak leg {index + 1}", (x, y, 0.22), m["wood"], length=0.40, radius=0.045, tilt=(0.05 * (1 if y < 0 else -1), 0.06 * (1 if x < 0 else -1), 0))
    add_cube("Ibiza teal seat", (0, -0.02, 0.74), (0.92, 0.78, 0.26), m["teal_fabric"], bevel=0.13)
    add_cube("Ibiza teal back", (0, 0.25, 1.20), (0.92, 0.19, 0.76), m["teal_fabric"], bevel=0.10, rotation=(-0.10, 0, 0))
    add_cube("Ibiza left side", (-0.43, 0.05, 0.93), (0.12, 0.65, 0.55), m["teal_fabric"], bevel=0.06)
    add_cube("Ibiza right side", (0.43, 0.05, 0.93), (0.12, 0.65, 0.55), m["teal_fabric"], bevel=0.06)


def build_la_spezia(m):
    add_cube("La Spezia rattan base", (0, 0, 0.43), (1.32, 1.08, 0.22), m["rattan_dark"], bevel=0.12)
    add_cube("La Spezia rattan back", (0, 0.34, 0.95), (1.28, 0.20, 0.98), m["rattan_dark"], bevel=0.14, rotation=(-0.12, 0, 0))
    add_cube("La Spezia left arm", (-0.60, 0.03, 0.86), (0.18, 0.83, 0.76), m["rattan_dark"], bevel=0.10, rotation=(0.02, 0.07, 0))
    add_cube("La Spezia right arm", (0.60, 0.03, 0.86), (0.18, 0.83, 0.76), m["rattan_dark"], bevel=0.10, rotation=(0.02, -0.07, 0))
    add_cube("La Spezia seat cushion", (0, -0.06, 0.65), (1.08, 0.78, 0.18), m["cream_fabric"], bevel=0.12)
    add_cube("La Spezia back cushion", (0, 0.225, 1.00), (1.02, 0.15, 0.68), m["ivory_fabric"], bevel=0.11, rotation=(-0.12, 0, 0))
    for index, x in enumerate((-0.50, 0.50)):
        add_leg(f"La Spezia front leg {index + 1}", (x, -0.36, 0.21), m["wood"], length=0.39, radius=0.042, tilt=(0, 0.08 * (-1 if x < 0 else 1), 0))


def build_monaco(m):
    add_cube("Monaco lounger rattan base", (0, 0, 0.46), (2.70, 1.04, 0.28), m["rattan_warm"], bevel=0.10)
    add_cube("Monaco lounger side left", (0, -0.42, 0.78), (2.58, 0.16, 0.62), m["rattan_warm"], bevel=0.07)
    add_cube("Monaco lounger side right", (0, 0.42, 0.78), (2.58, 0.16, 0.62), m["rattan_warm"], bevel=0.07)
    add_cube("Monaco seat cushion", (-0.15, 0, 0.70), (2.24, 0.78, 0.18), m["ivory_fabric"], bevel=0.11)
    add_cube("Monaco raised back cushion", (0.94, 0, 1.12), (0.30, 0.80, 0.88), m["cream_fabric"], bevel=0.12, rotation=(0, -0.18, 0))
    add_rattan_ribs("Monaco side", (-1.1, -0.72, -0.34, 0.04, 0.42, 0.80, 1.16), -0.515, 0.42, 0.99, m["rattan_dark"], radius=0.012)

    add_cube("Monaco side table top", (-1.48, -0.05, 0.58), (0.72, 0.62, 0.10), m["rattan_warm"], bevel=0.045)
    add_cube("Monaco side table shelf", (-1.48, -0.05, 0.24), (0.58, 0.48, 0.07), m["rattan_warm"], bevel=0.03)
    for index, (x, y) in enumerate(((-1.73, -0.24), (-1.23, -0.24), (-1.73, 0.14), (-1.23, 0.14))):
        add_leg(f"Monaco table leg {index + 1}", (x, y, 0.38), m["rattan_warm"], length=0.34, radius=0.028)


def build_riviera(m):
    add_cube("Riviera ottoman base", (0, 0, 0.38), (0.76, 0.76, 0.42), m["rattan_dark"], bevel=0.09)
    add_cube("Riviera ottoman cushion", (0, 0, 0.68), (0.62, 0.62, 0.18), m["ivory_fabric"], bevel=0.09)
    add_rattan_ribs("Riviera front", (-0.27, -0.09, 0.09, 0.27), -0.39, 0.24, 0.58, m["rattan_warm"], radius=0.012)


def build_sophia(m):
    add_cube("Sophia rattan base", (0, 0, 0.42), (2.15, 1.38, 0.42), m["rattan_dark"], bevel=0.20)
    add_uv_sphere("Sophia curved rattan shell", (0, 0.15, 0.75), (1.08, 0.69, 0.62), m["rattan_dark"])
    add_cube("Sophia seat cushion", (0, -0.07, 0.78), (1.74, 1.00, 0.22), m["cream_fabric"], bevel=0.17)
    add_uv_sphere("Sophia curved back cushion", (0, 0.35, 1.19), (0.90, 0.18, 0.67), m["ivory_fabric"])
    add_curve(
        "Sophia upper rattan arch",
        [(-0.92, 0.36, 0.80), (-0.72, 0.42, 1.40), (0, 0.45, 1.62), (0.72, 0.42, 1.40), (0.92, 0.36, 0.80)],
        0.045,
        m["rattan_dark"],
    )


BUILDERS = {
    "barcelona-able": build_barcelona,
    "bonaire-able": build_bonaire,
    "hawaii-able": build_hawaii,
    "ibiza-able": build_ibiza,
    "la-spezia-able": build_la_spezia,
    "monaco-able": build_monaco,
    "riviera-able": build_riviera,
    "sophia-able": build_sophia,
}


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for collection in list(bpy.data.collections):
        if collection.name != "Collection" and collection.users == 0:
            bpy.data.collections.remove(collection)


def add_render_setup(materials, target):
    floor = add_cube("POSTER_ONLY_floor", (0, 0, -0.08), (10, 10, 0.12), materials["ivory_fabric"], bevel=0.02)

    bpy.ops.object.camera_add(location=(4.4, -6.3, 3.45))
    camera = bpy.context.object
    camera.name = "POSTER_ONLY_camera"
    camera.data.lens = 56
    camera.data.sensor_width = 36
    direction = Vector(target) - camera.location
    camera.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    bpy.context.scene.camera = camera

    for name, location, energy, size in (
        ("POSTER_ONLY_key", (3.4, -3.8, 6.5), 950, 4.0),
        ("POSTER_ONLY_fill", (-4.0, -1.5, 3.8), 650, 3.0),
        ("POSTER_ONLY_rim", (1.5, 3.4, 4.8), 850, 3.0),
    ):
        bpy.ops.object.light_add(type="AREA", location=location)
        light = bpy.context.object
        light.name = name
        light.data.energy = energy
        light.data.shape = "DISK"
        light.data.size = size
        light.rotation_euler = (0.0, 0.0, 0.0)
        light_direction = Vector(target) - light.location
        light.rotation_euler = light_direction.to_track_quat("-Z", "Y").to_euler()

    world = bpy.context.scene.world
    if world is None:
        world = bpy.data.worlds.new("Poster world")
        bpy.context.scene.world = world
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = rgba((0.045, 0.052, 0.06))
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.32
    return floor


def remove_render_setup():
    helpers = [obj for obj in bpy.context.scene.objects if obj.name.startswith("POSTER_ONLY_")]
    for obj in helpers:
        bpy.data.objects.remove(obj, do_unlink=True)


def render_poster(poster_path, materials, target):
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 900
    scene.render.resolution_y = 700
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.film_transparent = False
    scene.render.filepath = str(poster_path)
    scene.render.image_settings.color_mode = "RGBA"
    floor = add_render_setup(materials, target)
    bpy.ops.render.render(write_still=True)
    remove_render_setup()
    return floor


def export_model(filepath):
    bpy.ops.export_scene.gltf(
        filepath=str(filepath),
        export_format="GLB",
        export_materials="EXPORT",
        export_apply=True,
    )


def main():
    MODEL_ROOT.mkdir(parents=True, exist_ok=True)
    SOURCE_ROOT.mkdir(parents=True, exist_ok=True)
    POSTER_ROOT.mkdir(parents=True, exist_ok=True)

    for product_id, builder in BUILDERS.items():
        clear_scene()
        materials = build_materials()
        builder(materials)

        product_model_root = MODEL_ROOT / product_id
        product_source_root = SOURCE_ROOT / product_id
        product_model_root.mkdir(parents=True, exist_ok=True)
        product_source_root.mkdir(parents=True, exist_ok=True)
        glb_path = product_model_root / f"{product_id}.glb"
        poster_path = POSTER_ROOT / f"{product_id}.png"
        source_path = product_source_root / f"{product_id}.blend"

        bpy.ops.wm.save_as_mainfile(filepath=str(source_path))
        render_poster(poster_path, materials, (0, 0, 0.75))
        export_model(glb_path)
        print(f"GENERATED {product_id} -> {glb_path}")

    clear_scene()
    print("All Lounge GLB models generated.")


if __name__ == "__main__":
    main()
