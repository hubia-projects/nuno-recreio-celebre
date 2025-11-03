# 📸 IMAGENS ORGANIZADAS - RECREIO CÉLEBRE TRANSFERS

## 📁 Estrutura Final das Imagens

### 🏛️ **Aveiro** (53 imagens)
- `aveiro-01.jpeg` até `aveiro-53.jpeg`
- Imagens da cidade de Aveiro, canais, moliceiros

### 🧂 **Aveiro Salinas** (13 imagens)
- `aveiro-salinas-01.jpeg` até `aveiro-salinas-13.jpeg`
- Imagens das salinas de Aveiro

### 🍷 **Douro** (54 imagens + 2 especiais)
- `douro-01.jpeg` até `douro-53.jpeg` (paisagens e vinhas)
- `douro-vinho-02.jpeg` (especial para prova de vinhos)

### 🏰 **Guimarães** (8 imagens)
- `guimaraes-01.jpeg` até `guimaraes-08.jpeg`
- Centro histórico e castelo de Guimarães

### ⛪ **Guimarães Nossa Senhora da Penha** (26 imagens)
- `guimaraes-penha-01.jpeg` até `guimaraes-penha-26.jpeg`
- Santuário e vistas panorâmicas

### 🙏 **Santuário de Fátima** (12 imagens)
- `fatima-01.jpeg` até `fatima-12.jpeg`
- Basílica e locais santos de Fátima

### 🚗 **Transfer** (1 imagem)
- `transfer-01.jpg`
- Veículo para transfers

---

## 🎯 **Como Usar as Imagens no Código**

### Exemplos de uso:
```html
<!-- Aveiro -->
<img src="images/Aveiro/aveiro-01.jpeg" alt="Canais de Aveiro">

<!-- Douro -->
<img src="images/Douro/douro-01.jpeg" alt="Vale do Douro">
<img src="images/Douro/douro-vinho-02.jpeg" alt="Prova de vinhos">

<!-- Guimarães -->
<img src="images/Guimaraes/guimaraes-01.jpeg" alt="Centro histórico">

<!-- Transfer -->
<img src="images/Tranfer/transfer-01.jpg" alt="Veículo transfer">
```

### Para carrosséis e galerias:
```javascript
// Exemplo para carregar múltiplas imagens do Douro
const dourotImages = [];
for(let i = 1; i <= 53; i++) {
    dourotImages.push(`images/Douro/douro-${i.toString().padStart(2, '0')}.jpeg`);
}
```

---

## ✅ **Vantagens da Nova Nomenclatura**

1. **Fácil de importar**: Nomenclatura sequencial e lógica
2. **Organizadas por destino**: Cada pasta tem seu tema
3. **Numeração padronizada**: 01, 02, 03... (sempre 2 dígitos)
4. **Sem espaços ou caracteres especiais**: Compatível com web
5. **Fácil manutenção**: Adicionar novas imagens é simples

---

## 📊 **Resumo Total**
- **6 destinos/categorias** organizados
- **166+ imagens** renomeadas
- **Nomenclatura consistente** em todas as pastas
- **Pronto para importação** em código HTML/CSS/JS

---

**Data da organização:** 3 de Novembro, 2025
**Status:** ✅ Completo e pronto para uso