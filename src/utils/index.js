import data from '../../data'

const SKINS = [
  '1F3FA', '1F3FB', '1F3FC',
  '1F3FD', '1F3FE', '1F3FF',
]

function unifiedToNative(unified) {
  var unicodes = unified.split('-'),
      codePoints = unicodes.map((u) => `0x${u}`)

  return String.fromCodePoint(...codePoints)
}

function sanitize(emoji) {
  var { name, short_names, skin_tone, emoticons, unified } = emoji,
      id = short_names[0],
      colons = `:${id}:`

  if (skin_tone) {
    colons += `:skin-tone-${skin_tone}:`
  }

  return {
    id,
    name,
    colons,
    emoticons,
    skin: skin_tone || 1,
    native: unifiedToNative(unified),
  }
}

function getSanitizedData() {
  return sanitize(getData(...arguments))
}

function getData(emoji, skin, sheetURL) {
  var emojiData = {}

  if (typeof emoji == 'string') {
    emojiData = data.emojis[emoji]
  } else if (emoji.id) {
    emojiData = data.emojis[emoji.id]
    skin || (skin = emoji.skin)
  }

  if (emojiData.skin_variations && skin > 1 && sheetURL) {
    emojiData = JSON.parse(JSON.stringify(emojiData))

    var skinKey = SKINS[skin - 1],
        variationKey = `${emojiData.unified}-${skinKey}`,
        variationData = emojiData.skin_variations[variationKey],
        kitMatches = sheetURL.match(/(apple|google|twitter|emojione)/),
        kit = kitMatches[0]

    if (variationData[`has_img_${kit}`]) {
      emojiData.skin_tone = skin

      for (let k in variationData) {
        let v = variationData[k]
        emojiData[k] = v
      }
    }
  }

  return emojiData
}

export {default as store} from './store'
export {default as emojiIndex} from './emoji-index'
export {default as frequently} from './frequently'

export { getData, getSanitizedData }
