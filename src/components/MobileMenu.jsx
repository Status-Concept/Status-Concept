export default function MobileMenu({ open, onClose }) {
  return (
    <>
      <div className={`moo ${open ? "op" : ""}`} onClick={onClose} />
      <div className={`mo ${open ? "op" : ""}`}>
        <button onClick={onClose} style={{position:"absolute",top:28,right:28,background:"none",border:"none",fontSize:28,cursor:"pointer",color:"var(--stone)",fontWeight:300}}>×</button>
        <nav style={{display:"flex",flexDirection:"column"}}>
          {[
            {l:"Furniture",s:["Lounge","Dining","Sun Loungers","Day Beds","Coffee Tables","Bar & Patio"]},
            {l:"Shade Solutions",s:["Parasols","Bioclimatic Pergolas","Retractable Pergolas"]},
            {l:"Outdoor Kitchens",s:["BBQ Systems","Pizza Ovens","Full Kitchens"]},
            {l:"Decor",s:["Carpets","Vases & Statues"]},
            {l:"Leisure",s:["Sound Systems"]},
            {l:"Projects",s:[]},
            {l:"Why Us",s:[]},
            {l:"After Care",s:[]},
            {l:"Contact",s:[]},
          ].map(item => (
            <div key={item.l} style={{borderBottom:"1px solid var(--sand-l)",padding:"16px 0"}}>
              <span className="ff" style={{fontSize:22,fontWeight:400,color:"var(--stone)",cursor:"pointer"}}>{item.l}</span>
              {item.s.length > 0 && (
                <div className="fs" style={{marginTop:10,display:"flex",flexDirection:"column",gap:6}}>
                  {item.s.map(s => (
                    <span key={s} style={{fontSize:12,letterSpacing:1,color:"var(--sand-d)",cursor:"pointer",paddingLeft:12}}>{s}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div style={{marginTop:32,display:"flex",gap:12}}>
          <span className="mb">Sunbrella®</span>
          <span className="mb">Glatz</span>
        </div>
      </div>
    </>
  )
}
