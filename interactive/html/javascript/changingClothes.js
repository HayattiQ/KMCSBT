const requestURL = './javascript/layers.json'
const request = new XMLHttpRequest()
request.open('GET', requestURL)
request.responseType = 'json'
request.send()
request.onload = async () => {
  let layers = request.response
  layers = JSON.parse(JSON.stringify(layers)).layers

  const modeBtn = document.querySelector('.mode-btn')
  const colorSort = document.querySelector('.color-sort')
  const layersDOM = document.querySelector('.layers')
  const stylesDOM = document.querySelector('.styles')
  const detailsDOM = document.querySelector('.details')

  // レイヤーディレクトリをランダムセットする & 着せ替えレイヤーをセットする
  let layerDOMs = ''
  let stylesDOMs = ''
  let detailsDOMs = ''
  Object.entries(layers).forEach(async (layer, index) => {
    let image = ''

    switch (layer[0]) {
      case '01_background':
        image = 'Blue_Green.png'
        break
      case '02_special3':
        image = 'None.png'
        break
      case '03_back':
        image = 'None.png'
        break
      case '04_water_back':
        image = 'Pink.png'
        break
      case '05_hair_back':
        image = 'blue_Bob.png'
        break
      case '06_ears_back':
        image = 'None.png'
        break
      case '07_face':
        image = 'Orange.png'
        break
      case '08_special1':
        image = 'None.png'
        break
      case '09_mouth':
        image = 'Neutral.png'
        break
      case '10_clothes':
        image = 'blue_Uniform_1.png'
        break
      case '11_hair_middle':
        image = 'blue_Bob.png'
        break
      case '12_eyes':
        image = 'blue_Drooping.png'
        break
      case '13_mask':
        image = 'None.png'
        break
      case '14_hair':
        image = 'blue_Bob.png'
        break
      case '15_ears':
        image = 'None.png'
        break
      case '16_forehead':
        image = 'None.png'
        break
      case '17_glasses':
        image = 'None.png'
        break
      case '18_water':
        image = 'Pink.png'
        break
      case '19_water_top':
        image = 'Pink.png'
        break
      case '20_hands':
        image = 'Orange_Grip.png'
        break
      case '21_special2':
        image = 'None.png'
        break
    }

    let rootPath = '.'
    const imagePath = `/img/layers/${layer[0]}/${image}`
    layerDOMs += `<img src="${
      rootPath + imagePath
    }" class="layer" data-layer="${layer[0]}" />`

    const layerIndexPad = String(index + 1).padStart(2, '0')
    const layerTitle = layer[0]
      .replace(`${layerIndexPad}_`, '')
      .replace(/,/g, ' ')
    stylesDOMs += `<div class="style" data-layer="${
      layer[0]
    }" onClick="showDetail('${layer[0]}')">
    <img src="${rootPath + imagePath}" class="thumbnail" />
    <p class="txt">${layerTitle}</p>
    </div>`

    let imagesDOM = ''
    const backBtn = `<div class="back-btn" onclick="backDetail(this)"><img src="./img/icons/back.svg" alt="back" /></div>`
    layer[1].forEach((image) => {
      const imagePath = `/img/layers/${layer[0]}/${image}`
      const color = setColor(image.replace('.png', '').replace(/_/g, '-'))
      imagesDOM += `<div class="image" onclick="changeParts(this)" data-color="${color}">
        <img src="${rootPath + imagePath}" class="thumbnail" />
        <p class="txt">${image.replace('.png', '').replace(/_/g, ' ')}</p>
      </div>`
    })
    detailsDOMs += `<div class="detail" data-layer="${layer[0]}">
      ${backBtn}
      <div class="images">
        ${imagesDOM}
      </div>
    </div>`

    if (index !== 0) return

    // ボタンを表示
    modeBtn.classList.add('show')
  })

  layersDOM.innerHTML = layerDOMs
  stylesDOM.innerHTML = stylesDOMs
  detailsDOM.innerHTML = detailsDOMs

  modeBtn.addEventListener('click', () => {
    const isChecked = modeBtn.classList.contains('checked')
    if (isChecked) {
      modeBtn.style.bottom = '5%'
      colorSort.style.bottom = '5%'
      modeBtn.classList.remove('checked')
      stylesDOM.classList.remove('checked')
      colorSort.classList.remove('show')

      const detailsDOM = document.querySelector('.details')
      if (!detailsDOM.classList.contains('checked')) return
      detailsDOM.classList.remove('checked')
      const details = detailsDOM.querySelectorAll('.checked')
      details.forEach((detail) => {
        detail.classList.remove('checked')
      })
    } else {
      const styleDomHeight = stylesDOM.clientHeight + 5
      modeBtn.style.bottom = `${styleDomHeight}px`
      colorSort.style.bottom = `${styleDomHeight}px`
      modeBtn.classList.add('checked')
      stylesDOM.classList.add('checked')
      colorSort.classList.add('show')
    }
  })
}

const showDetail = (layer) => {
  const details = document.querySelector('.details')
  const targetDetail = details.querySelector(`[data-layer="${layer}"]`)
  if (targetDetail.classList.contains('checked')) return

  details.classList.add('checked')
  targetDetail.classList.add('checked')
}

const checkDetail = (e) => {
  const target = e
  console.log(target)
}

const backDetail = (e) => {
  const target = e
  const detail = target.parentNode
  const details = detail.parentNode

  detail.classList.remove('checked')
  details.classList.remove('checked')
}

const changeParts = (e) => {
  const target = e
  const image = target.querySelector('.thumbnail')
  const parent = target.parentNode.parentNode
  const layer = parent.dataset.layer
  const layersDOM = document.querySelector('.layers')
  const layerDOM = layersDOM.querySelector(`[data-layer="${layer}"]`)
  layerDOM.src = image.src

  const stylesDOM = document.querySelector('.styles')
  const styleDOM = stylesDOM.querySelector(`[data-layer="${layer}"]`)
  const styleImage = styleDOM.querySelector('.thumbnail')
  styleImage.src = image.src

  syncLayer(layer, image.src)
}

const syncLayer = (layer, image) => {
  const syncLayers = {
    water: ['04_water_back', '18_water', '19_water_top'],
    hair: ['05_hair_back', '11_hair_middle', '14_hair'],
    ears: ['06_ears_back', '15_ears'],
  }

  const keyword = layer.split('_')[1]
  if (keyword !== 'water' && keyword !== 'hair' && keyword !== 'ears') return

  syncLayers[keyword].forEach((syncLayer) => {
    const layersDOM = document.querySelector('.layers')
    const layerDOM = layersDOM.querySelector(`[data-layer="${syncLayer}"]`)
    if (!layerDOM) return

    const splitSrc = layerDOM.src.split('/')
    splitSrc[6] = image.split('/')[6]
    const imagePath = splitSrc.join('/')
    layerDOM.src = imagePath

    const stylesDOM = document.querySelector('.styles')
    const styleDOM = stylesDOM.querySelector(`[data-layer="${syncLayer}"]`)
    const styleImage = styleDOM.querySelector('.thumbnail')
    styleImage.src = imagePath
  })
}

const setColor = (fileName) => {
  let colors = [
    'blue',
    'blue-green',
    'green',
    'light-blue',
    'navy',
    'orange',
    'pink',
    'purple',
    'red',
    'yellow',
  ]

  colors = colors
    .map((color) => {
      if (fileName.toLowerCase().indexOf(color) != -1) {
        return color
      } else {
        return null
      }
    })
    .filter(Boolean)

  // 例外処理
  if (colors.indexOf('blue-green') != -1) {
    colors = ['blue-green']
  } else if (colors.indexOf('light-blue') != -1) {
    colors = ['light-blue']
  } else if (colors.length <= 0) {
    colors = ['other']
  }
  return colors[0]
}

const sortImages = (e) => {
  const target = e
  const color = target.dataset.sortcolor
  const colorDOMs = document.querySelectorAll('[data-color]')
  const sortButtons = document.querySelectorAll('[data-sortcolor]')

  if (color === 'all') {
    colorDOMs.forEach((colorDOM) => {
      colorDOM.classList.remove('hidden')
    })

    sortButtons.forEach((btn) => {
      btn.classList.remove('unchecked')
    })
  } else {
    colorDOMs.forEach((colorDOM) => {
      colorDOM.classList.add('hidden')
    })

    const sortColorDOMs = document.querySelectorAll(`[data-color=${color}]`)
    sortColorDOMs.forEach((colorDOM) => {
      colorDOM.classList.remove('hidden')
    })

    sortButtons.forEach((btn) => {
      btn.classList.add('unchecked')
    })
    target.classList.remove('unchecked')
  }
}
