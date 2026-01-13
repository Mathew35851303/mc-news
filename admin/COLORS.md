# 🎨 Palette de couleurs - Interface Admin

## Couleurs principales (Orange)

Inspirées du logo Los Nachos Chipies :

### Orange Principal
- **Primaire** : `#ff6b35` (RGB: 255, 107, 53)
- **Secondaire** : `#f7931e` (RGB: 247, 147, 30)
- **Sombre** : `#e65a2a` (RGB: 230, 90, 42)

### Dégradés
- **Header** : `linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)`
- **Boutons** : `linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)`
- **Background page** : `linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)`

### Ombres
- **Focus** : `box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1)`
- **Hover boutons** : `box-shadow: 0 8px 20px rgba(255, 107, 53, 0.4)`
- **Hover toolbar** : `box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3)`

### Backgrounds clairs
- **Hover refresh** : `#fff5f2` (très léger orange)

---

## Couleurs secondaires

### Succès (Vert)
- **Success** : `#4CAF50`

### Danger (Rouge)
- **Danger** : `#f44336`
- **Danger hover** : `#d32f2f`

### Texte
- **Texte principal** : `#333`
- **Texte secondaire** : `#666`
- **Texte grisé** : `#999`

### Bordures et fonds
- **Bordure** : `#e0e0e0`
- **Background clair** : `#f5f5f5`
- **Background carte** : `#f8f9fa`
- **Badge "NEW"** : `#FFD700` (Or)

---

## Correspondance avec l'identité visuelle

La palette orange (`#ff6b35` → `#f7931e`) est directement inspirée du logo et de l'identité visuelle "Los Nachos Chipies", créant une cohérence entre le launcher et l'interface d'administration.

### Avant (Violet/Bleu)
- `#667eea` (Bleu violet)
- `#764ba2` (Violet)

### Après (Orange)
- `#ff6b35` (Orange vif)
- `#f7931e` (Orange doré)

---

## Fichiers modifiés

Tous les fichiers CSS ont été mis à jour avec la nouvelle palette :

- ✅ `index.css` - Variables CSS globales
- ✅ `Login.css` - Page de connexion
- ✅ `Dashboard.css` - Tableau de bord
- ✅ `NewsForm.css` - Formulaire de création/édition
- ✅ `NewsList.css` - Liste des actualités

---

## Usage dans le code

```css
/* Exemple - Bouton principal */
.btn-primary {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
}

.btn-primary:hover {
  box-shadow: 0 8px 20px rgba(255, 107, 53, 0.4);
}

/* Exemple - Focus input */
input:focus {
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

/* Exemple - Icône/texte orange */
.icon-primary {
  color: #ff6b35;
}
```

---

## Variables CSS disponibles

Dans `index.css` :

```css
:root {
  --primary: #ff6b35;
  --primary-dark: #e65a2a;
  --success: #4CAF50;
  --danger: #f44336;
  --warning: #f7931e;
  --info: #ff6b35;
  --text: #333;
  --text-light: #666;
  --border: #e0e0e0;
  --bg-light: #f5f5f5;
}
```

Usage :
```css
.mon-element {
  color: var(--primary);
  background: var(--bg-light);
}
```
