# 👑 DERECK — Urban Style

Tienda online de ropa urbana para hombre. Sin pasarela de pago: el cliente arma su pedido y se envía directo a tu WhatsApp con talla, color y precio ya escritos.

## Estructura del proyecto

```
dereck/
├── index.html          ← Página principal (única página, todo en secciones)
├── css/
│   └── styles.css      ← Todos los estilos (paleta crema/negro/bronce)
├── js/
│   └── main.js         ← Carrito, filtros, modal de producto, WhatsApp
└── img/
    ├── logo-dereck.png ← Tu logo (ya está aquí)
    └── productos/      ← Aquí van las fotos de tus productos
```

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
2. En `index.html`, busca la tarjeta del producto y reemplaza:

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

Copia este bloque dentro de `<div id="productsGrid">` en `index.html` y edita los datos:

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

**Importante:** si no hay descuento, simplemente borra la línea `data-original="..."` y el bloque `<s class="original-price">...</s>` del precio, y quita la etiqueta `<span class="product-tag oferta-tag">`.

**Categorías de filtro disponibles:** `polo`, `hoodie`, `jogger`, `oferta`. Puedes combinar varias: `data-category="hoodie oferta"`.

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
En `index.html`, busca `.announcement-track` y edita los `<span>`.

### Cambiar textos del "Nosotros"
Busca la sección `<section class="about-section" id="nosotros">` en `index.html`.

### Foto de la sección "Nosotros"
Reemplaza el bloque con clase `.about-image.placeholder-img` por:
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
