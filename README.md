# 👑 DERECK — Urban Style

Tienda online de ropa urbana para hombre. Sin pasarela de pago: el cliente arma su pedido y se envía directo a tu WhatsApp con talla, color y precio ya escritos.

> **Actualización:** ahora cada categoría tiene su propio archivo HTML y CSS,
> y el precio puede cambiar según la talla (por ejemplo, XL más caro).
> Todo lo demás (carrito, favoritos, WhatsApp) sigue funcionando igual.

## Estructura del proyecto

```
dereck/
├── index.html          ← Página de inicio: hero, categorías y novedades
├── jeans.html           ← Catálogo de Jeans
├── buzos.html           ← Catálogo de Buzos
├── polos.html           ← Catálogo de Polos
├── poleras.html         ← Catálogo de Poleras
├── casacas.html         ← Catálogo de Casacas
├── shorts.html          ← Catálogo de Shorts
├── zapatillas.html      ← Catálogo de Zapatillas
├── gorras.html          ← Catálogo de Gorras
├── ofertas.html         ← Todos los productos en oferta, de cualquier categoría
├── css/
│   ├── styles.css       ← Estilos globales: header, footer, carrito, modal (paleta crema/negro/bronce)
│   └── categorias/      ← Un CSS pequeño por categoría (color de acento, detalles propios)
│       ├── jeans.css
│       ├── buzo.css
│       ├── polo.css
│       ├── polera.css
│       ├── casaca.css
│       ├── short.css
│       ├── zapatilla.css
│       ├── gorra.css
│       └── ofertas.css
├── js/
│   └── main.js          ← Carrito, filtros, modal de producto, WhatsApp, precio por talla
└── img/
    ├── logo-dereck.png ← Tu logo (ya está aquí)
    └── productos/      ← Aquí van las fotos de tus productos
```

### ¿Por qué está separado así?

Antes, las 135 tarjetas de producto de las 8 categorías vivían todas juntas
dentro de un solo `index.html` gigante (más de 3,400 líneas), lo que hacía
difícil encontrar el producto que querías editar. Ahora cada categoría tiene
su propio archivo: si quieres tocar un jean, abres `jeans.html`; si quieres
tocar una gorra, abres `gorras.html`. El carrito, los favoritos y el modal de
compra siguen siendo los mismos en todas las páginas (viven en `css/styles.css`
y `js/main.js`), así que agregar un producto nuevo o corregir un precio es
mucho más rápido.

**Importante:** el carrito y los favoritos se guardan en el navegador
(`localStorage`), así que si un cliente agrega un jean y luego entra a
`buzos.html`, su carrito lo sigue esperando ahí — no se pierde al cambiar de
página.

---

## 🚀 Cómo abrir en VS Code

1. Abre VS Code → Archivo → Abrir Carpeta → selecciona `dereck/`
2. Instala la extensión **Live Server**
3. Click derecho en `index.html` → **Open with Live Server**

---

## 📱 Configurar tu WhatsApp

Ya está configurado con tu número **+51 970 530 749**. Si necesitas cambiarlo en el futuro:

Abre `js/main.js`, línea 4:
```js
const WHATSAPP_NUMBER = "51970530749";
```
Reemplaza por tu nuevo número (con código de país, sin `+` ni espacios).

---

## 🖼️ Cómo agregar tus fotos de producto

1. Copia tus fotos a `img/productos/` (ejemplo: `img/productos/polo-negro.jpg`)
2. Abre el archivo de la categoría correspondiente (por ejemplo `polos.html`), busca la tarjeta del producto y reemplaza:

```html
<!-- ANTES -->
<div class="product-img placeholder-img">
  <i class="fas fa-image"></i>
  <span>Tu imagen aquí</span>
</div>

<!-- DESPUÉS -->
<div class="product-img">
  <img src="img/productos/polo-negro.jpg" alt="Polo Oversize Negro"/>
</div>
```

La foto del modal (la que aparece al elegir talla/color) se toma automáticamente de esta misma imagen, no necesitas configurarla aparte.

---

## 📦 Cómo agregar un nuevo producto

Abre el archivo de la categoría donde va tu producto (por ejemplo `jeans.html`
para un jean, o `gorras.html` para una gorra) y copia este bloque dentro de
`<div id="productsGrid">`, editando los datos:

```html
<div class="product-card"
     data-category="polo"
     data-price="89"
     data-original="119"
     data-name="Nombre del Producto"
     data-colors="Negro,Blanco,Gris"
     data-sizes="S,M,L,XL">
  <div class="product-image-wrap">
    <div class="product-img">
      <img src="img/productos/tu-foto.jpg" alt="Nombre del Producto"/>
    </div>
    <div class="product-overlay">
      <button class="quick-add" onclick="openProductModal(this)">
        <i class="fab fa-whatsapp"></i> Comprar
      </button>
    </div>
    <button class="wishlist-heart" onclick="toggleWishlist(this)">
      <i class="far fa-heart"></i>
    </button>
    <span class="product-tag oferta-tag">-25%</span>
  </div>
  <div class="product-info">
    <h3 class="product-name">Nombre del Producto</h3>
    <p class="product-price">S/ 89 <s class="original-price">S/ 119</s></p>
  </div>
</div>
```

### Explicación de cada atributo `data-*`:

| Atributo | Qué hace | Ejemplo |
|---|---|---|
| `data-category` | Para qué filtro(s) aparece | `"polo"`, `"hoodie oferta"` |
| `data-price` | Precio actual (sin S/) | `"89"` |
| `data-original` | Precio tachado (opcional, bórralo si no hay descuento) | `"119"` |
| `data-name` | Nombre que se manda a WhatsApp | `"Polo Oversize Negro"` |
| `data-colors` | Colores disponibles, separados por coma | `"Negro,Blanco,Gris"` |
| `data-sizes` | Tallas disponibles, separadas por coma | `"S,M,L,XL"` |
| `data-size-extra` (opcional) | Recargo por talla, solo para ESTE producto | `'{"XL":15,"XXL":20}'` |

**Importante:** si no hay descuento, simplemente borra la línea `data-original="..."` y el bloque `<s class="original-price">...</s>` del precio, y quita la etiqueta `<span class="product-tag oferta-tag">`.

**Categorías de filtro disponibles:** `jeans`, `buzo`, `polo`, `polera`, `casaca`, `short`, `zapatilla`, `gorra`, `oferta`. Puedes combinar varias: `data-category="polo oferta"`.

**Sobre las ofertas:** todos los productos en oferta se muestran únicamente en
`ofertas.html`, para no repetirlos también en su página de categoría. Si
quieres poner un producto en oferta, agrégalo directamente en `ofertas.html`
(no en `jeans.html`, `buzos.html`, etc.).

---

## 💰 Precio distinto según talla (ej. XL más caro)

Por defecto, todas las tallas de un producto cuestan lo mismo (`data-price`).
Si quieres que una talla específica cueste más (por ejemplo, porque usa más
tela), tienes dos formas de hacerlo, en `js/main.js`:

### Opción 1: Regla general para todo el catálogo
Al inicio de `js/main.js` encontrarás:
```js
const SIZE_SURCHARGES = {
  "XL": 10,
  "XXL": 15
};
```
Esto significa: *"cualquier producto que tenga talla XL, cóbrale S/10 extra"*.
Cambia estos números por los que tú quieras, o agrega más tallas
(por ejemplo `"L": 5`).

### Opción 2: Recargo solo para un producto puntual
Si un producto en particular necesita un recargo distinto al general, agrégale
el atributo `data-size-extra` con el precio extra de cada talla en formato JSON:
```html
<div class="product-card"
     data-category="casaca"
     data-price="180"
     data-name="Casaca Bomber Premium"
     data-colors="Negro,Verde"
     data-sizes="S,M,L,XL,XXL"
     data-size-extra='{"XL":20,"XXL":30}'>
```
Este producto ignorará el `SIZE_SURCHARGES` general y usará S/20 extra en XL
y S/30 extra en XXL. Si una talla no aparece en `data-size-extra` ni en
`SIZE_SURCHARGES`, no tiene recargo (cuesta el precio normal).

El recargo se muestra automáticamente junto al botón de la talla en el modal
(ej. "XL +S/10"), y se suma solita al total, al carrito y al mensaje de
WhatsApp — no hace falta tocar nada más.

---

## ✏️ Personalización rápida

### Cambiar colores de marca
En `css/styles.css`, al inicio, edita las variables:
```css
--cream: #EDEAE0;      /* Fondo principal */
--black: #0E0E0E;      /* Negro de textos y header oscuro */
--bronze: #A8763E;     /* Color de acento (precios, botones) */
```

### Cambiar mensaje de la barra superior (anuncio)
Busca `.announcement-track` — aparece igual en todas las páginas (`index.html`,
`jeans.html`, `buzos.html`, etc.), así que si quieres cambiar el texto en todo
el sitio, tendrás que editarlo en cada archivo (es el único bloque que se
repite así, porque no usamos un sistema de plantillas).

### Cambiar textos del "Nosotros"
Busca la sección `<section class="about-section" id="nosotros">`. Esta sección
solo existe en `index.html` (la página de inicio).

### Foto de la sección "Nosotros"
En `index.html`, reemplaza el bloque con clase `.about-image.placeholder-img` por:
```html
<div class="about-image">
  <img src="img/tu-foto-tienda.jpg" alt="DERECK"/>
</div>
```

---

## ✅ Funcionalidades incluidas

- ✅ Header con tu logo y menú de navegación
- ✅ Barra de anuncios animada (marquee)
- ✅ Hero con tu identidad de marca (corona + tipografía serif)
- ✅ Franja de confianza (envíos, WhatsApp, cambios, calidad)
- ✅ Filtros por categoría (Polos, Hoodies, Joggers, Ofertas)
- ✅ Búsqueda en tiempo real
- ✅ Ordenar productos (precio, nombre)
- ✅ **Modal de producto** con selector de talla, color y cantidad
- ✅ **Botón "Comprar por WhatsApp"** → abre WhatsApp con mensaje pre-armado (producto, talla, color, precio)
- ✅ **Carrito lateral** que junta varios productos y los manda todos juntos por WhatsApp con el total
- ✅ Wishlist (favoritos)
- ✅ Botón flotante de WhatsApp siempre visible
- ✅ Sección "Nosotros"
- ✅ Footer con tus datos de contacto
- ✅ Diseño responsive (móvil y desktop)
- ✅ Sin pasarela de pago — 100% orientado a WhatsApp

---

## 💬 Cómo funciona el flujo de compra

1. El cliente hace click en **"Comprar"** sobre un producto
2. Se abre un modal donde elige **talla**, **color** y **cantidad**
3. Tiene dos opciones:
   - **"Agregar al carrito"** → lo guarda y puede seguir comprando más productos
   - **"Comprar por WhatsApp"** → lo manda directo a WhatsApp con ese producto
4. Si usó el carrito, al hacer click en **"Finalizar pedido por WhatsApp"**, se abre WhatsApp con la lista completa de productos, tallas, colores, cantidades y el total a pagar — todo ya escrito, el cliente solo presiona enviar.
