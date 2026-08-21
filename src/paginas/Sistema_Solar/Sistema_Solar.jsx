import Sistema_Solar_Orbita from './Sistema_Solar_Orbita'
import './Sistema_Solar.css'

function Sistema_Solar() {
  return (
    <main className="pagina-sistema-solar">
      <section className="sistema-hero">
        <div className="sistema-hero-glow"></div>

        <div className="sistema-hero-contenido">
          <span className="sistema-etiqueta">
            EXPLORACIÓN · ASTRONOMÍA · COSMOS
          </span>

          <h1>
            Nuestro
            <span>Sistema Solar</span>
          </h1>

          <p>
            Ocho mundos, una estrella y miles de millones de objetos
            moviéndose en una enorme arquitectura cósmica.
          </p>
        </div>
      </section>

      <section className="sistema-interactivo">
        <Sistema_Solar_Orbita />
      </section>

      <section className="sistema-informacion">
        <div className="informacion-introduccion">
          <span className="mini-etiqueta">
            MÁS ALLÁ DE LAS ÓRBITAS
          </span>

          <h2>
            Un sistema mucho más grande
            <span> que ocho planetas.</span>
          </h2>
        </div>

        <div className="informacion-texto">
          <p>
            El Sistema Solar es nuestro pequeño vecindario cósmico, pero
            reducirlo a ocho planetas sería dejar afuera una enorme parte
            de la historia. En el centro se encuentra el Sol, una estrella
            cuya gravedad mantiene ligado todo el sistema y alrededor de la
            cual orbitan planetas, planetas enanos, lunas, asteroides,
            cometas, meteoroides y enormes cantidades de polvo y partículas.
          </p>

          <p>
            Hace aproximadamente 4.600 millones de años, una gigantesca
            nube de gas y polvo comenzó a colapsar bajo su propia gravedad.
            La mayor parte del material terminó concentrándose en el centro,
            donde nació el Sol, mientras que el resto formó un disco
            giratorio. Con el tiempo, pequeñas partículas comenzaron a
            chocar, unirse y crecer hasta formar cuerpos cada vez mayores,
            dando lugar a los mundos que conocemos actualmente.
          </p>

          <p>
            Los cuatro planetas más cercanos al Sol —Mercurio, Venus, la
            Tierra y Marte— son mundos rocosos. Son relativamente pequeños
            y poseen superficies sólidas. Más allá de ellos aparecen los
            gigantes: Júpiter y Saturno son gigantes gaseosos, mientras que
            Urano y Neptuno pertenecen al grupo de los gigantes helados.
            Cada grupo se formó bajo condiciones diferentes y terminó
            desarrollando propiedades completamente distintas.
          </p>

          <p>
            El Sistema Solar tampoco termina cuando dejamos atrás Neptuno.
            En las regiones exteriores existen enormes poblaciones de
            cuerpos helados, especialmente en el cinturón de Kuiper. Mucho
            más lejos todavía se encuentra la región asociada a la nube de
            Oort, una estructura hipotética que se considera una posible
            reserva de cometas de período largo.
          </p>

          <p>
            Incluso las órbitas que ves en esta representación son una
            simplificación visual. Las distancias reales son tan gigantescas
            que representar los tamaños y separaciones a escala sería
            prácticamente imposible en una pantalla. Por eso el modelo está
            diseñado para priorizar la exploración y la lectura visual:
            podés acercarte, desplazarte y reconocer fácilmente cada mundo
            mientras sus movimientos mantienen la sensación de un sistema
            vivo.
          </p>
        </div>
      </section>

      <section className="curiosidades">
        <div className="curiosidades-titulo">
          <span className="mini-etiqueta">
            DATOS QUE NO PARECEN REALES
          </span>

          <h2>
            Algunas cosas
            <span> bastante locas.</span>
          </h2>
        </div>

        <div className="curiosidades-grid">
          <article className="curiosidad">
            <h3>Venus es el planeta más caliente</h3>

            <p>
              Aunque Mercurio está más cerca del Sol, Venus posee una
              atmósfera extremadamente densa que provoca un fuerte efecto
              invernadero. Por eso su superficie alcanza temperaturas
              superiores a las de cualquier otro planeta del Sistema Solar.
            </p>
          </article>

          <article className="curiosidad">
            <h3>Júpiter es gigantesco</h3>

            <p>
              Júpiter es el planeta más grande del Sistema Solar. Su tamaño
              es tan descomunal que su volumen permitiría introducir cerca
              de mil Tierras en su interior.
            </p>
          </article>

          <article className="curiosidad">
            <h3>Mercurio no tiene lunas</h3>

            <p>
              Mercurio y Venus son los únicos dos planetas del Sistema Solar
              que no poseen lunas naturales conocidas.
            </p>
          </article>

          <article className="curiosidad">
            <h3>Los cuatro gigantes tienen anillos</h3>

            <p>
              Saturno es famoso por sus anillos, pero no es el único. Júpiter,
              Urano y Neptuno también poseen sistemas de anillos, aunque son
              mucho más débiles y difíciles de observar.
            </p>
          </article>

          <article className="curiosidad">
            <h3>Plutón ya no es un planeta</h3>

            <p>
              Desde 2006, Plutón está clasificado oficialmente como planeta
              enano. La definición formal de planeta dejó al Sistema Solar
              con ocho planetas reconocidos.
            </p>
          </article>

          <article className="curiosidad">
            <h3>El Sistema Solar también se mueve</h3>

            <p>
              Nuestro sistema completo viaja alrededor del centro de la Vía
              Láctea. Completar una vuelta galáctica requiere cientos de
              millones de años.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default Sistema_Solar