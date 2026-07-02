import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCompare, COMPARE_LIMIT } from "../../CompareContext";
import SpotlightTour from "../../components/SpotlightTour";

const ROWS = [
  { key: "collection", label: "Colecao", value: (p) => p.collectionName || p.collection || "-" },
  { key: "category", label: "Categoria", value: (p) => p.categoryLabel || p.category || "-" },
  { key: "supplier", label: "Fornecedor", value: (p) => p.supplier || "-" },
  { key: "sku", label: "SKU", value: (p) => p.sku || "-" },
  { key: "desc", label: "Descricao", value: (p) => p.desc || p.tagline || "-" },
];

const TOUR_STEPS = [
  { target: null, title: "Bem-vindo ao comparador", text: "Aqui podes comparar ate 3 produtos da mesma categoria, lado a lado." },
  { target: "[data-tour='compare-table']", title: "A tua comparacao", text: "Cada coluna e um produto. As linhas mostram colecao, fornecedor, SKU e descricao para comparares rapidamente." },
  { target: "[data-tour='compare-add']", title: "Adicionar produtos", text: "No catalogo, usa o botao de setas nos cartoes de produto para adicionar ao comparador. So aceita produtos da mesma categoria, ate 3." },
  { target: "[data-tour='compare-excel']", title: "Exportar para Excel", text: "Este botao transfere a comparacao como folha de calculo Excel, pronta a partilhar." },
  { target: "[data-tour='compare-clear']", title: "Limpar", text: "Remove produtos individualmente no topo de cada coluna, ou limpa a comparacao toda aqui." },
];

export default function ClientCompare() {
  const navigate = useNavigate();
  const { compareItems, removeCompare, clearCompare } = useCompare();
  const [tourOpen, setTourOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const downloadExcel = async () => {
    if (!compareItems.length || exporting) return;
    setExporting(true);
    try {
      const XLSX = await import("xlsx");
      const header = ["", ...compareItems.map((p) => p.name)];
      const rows = ROWS.map((row) => [row.label, ...compareItems.map((p) => row.value(p))]);
      const sheet = XLSX.utils.aoa_to_sheet([header, ...rows]);
      sheet["!cols"] = [{ wch: 14 }, ...compareItems.map(() => ({ wch: 42 }))];
      const book = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(book, sheet, "Comparacao");
      XLSX.writeFile(book, "statvs-comparacao.xlsx");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="account-panel">
      <span className="fs sl">Comparador</span>
      <div className="account-heading-row">
        <div>
          <h2 className="ff">Comparar produtos</h2>
          <p className="fs account-copy">Ate {COMPARE_LIMIT} produtos da mesma categoria, lado a lado.</p>
        </div>
        <div className="compare-toolbar">
          <button type="button" className="account-clear fs" onClick={() => setTourOpen(true)}>Como usar</button>
          {compareItems.length > 0 && (
            <>
              <button type="button" data-tour="compare-excel" className="cb cg fs" onClick={downloadExcel} disabled={exporting}>
                {exporting ? "A preparar..." : "Transferir Excel"}
              </button>
              <button type="button" data-tour="compare-clear" className="account-clear fs" onClick={clearCompare}>Limpar tudo</button>
            </>
          )}
        </div>
      </div>

      {compareItems.length === 0 ? (
        <div className="account-empty">
          <h3 className="ff">O comparador esta vazio</h3>
          <p className="fs">No catalogo, toca no botao de setas de um produto para o adicionar aqui.</p>
          <button type="button" data-tour="compare-add" className="cb cd" onClick={() => navigate("/products")}>Ver produtos</button>
        </div>
      ) : (
        <div className="compare-table-wrap" data-tour="compare-table">
          <table className="compare-table fs">
            <thead>
              <tr>
                <th aria-hidden="true" />
                {compareItems.map((p) => (
                  <th key={p.id}>
                    <div className="compare-product-head">
                      <button type="button" className="compare-remove" aria-label={`Remover ${p.name}`} onClick={() => removeCompare(p.id)}>×</button>
                      <img src={p.img} alt={p.name} onClick={() => navigate(p.route || `/product/${p.id}`)} />
                      <h3 className="ff">{p.name}</h3>
                    </div>
                  </th>
                ))}
                {compareItems.length < COMPARE_LIMIT && (
                  <th className="compare-empty-col">
                    <button type="button" data-tour="compare-add" onClick={() => navigate("/products")}>
                      + Adicionar produto
                    </button>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.key}>
                  <th scope="row">{row.label}</th>
                  {compareItems.map((p) => (
                    <td key={p.id}>{row.value(p)}</td>
                  ))}
                  {compareItems.length < COMPARE_LIMIT && <td className="compare-empty-col" />}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SpotlightTour steps={TOUR_STEPS} open={tourOpen} onClose={() => setTourOpen(false)} />
    </div>
  );
}
