import LocalizedLink from '../../components/LocalizedLink'
import FavoriteButton from '../../FavoriteButton'
import { useFavorites } from '../../FavoritesContext'

export default function ClientFavorites() {
  const { favorites, clearFavorites } = useFavorites()

  return (
    <div className="account-panel">
      <span className="fs sl">Favoritos</span>
      <div className="account-heading-row">
        <div>
          <h2 className="ff">Favoritos persistentes</h2>
          <p className="fs account-copy">Os favoritos ficam associados a tua conta quando tens sessao iniciada.</p>
        </div>
        {favorites.length > 0 && (
          <button type="button" className="account-clear fs" onClick={clearFavorites}>Limpar todos</button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="account-empty">
          <h3 className="ff">Ainda nao guardaste favoritos</h3>
          <p className="fs">Explora produtos e toca no coracao para os guardar aqui.</p>
          <LocalizedLink className="cb cd" to="/products">Ver produtos</LocalizedLink>
        </div>
      ) : (
        <div className="account-favorites-grid">
          {favorites.map((item) => (
            <article key={item.id} className="account-favorite-card">
              <div>
                <img src={item.img || '/placeholder.svg'} alt={item.name || item.id} />
                <FavoriteButton product={item} size={16} style={{ position: 'absolute', top: 12, right: 12 }} />
              </div>
              <h3 className="ff"><LocalizedLink className="rd-card-link" to={item.route || `/product/${item.id}`}>{item.name || item.id}</LocalizedLink></h3>
              <p className="fs">{item.collection || 'Statvs'} Collection</p>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

