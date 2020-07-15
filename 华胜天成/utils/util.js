const httpsUrl = 'https://hhh.juzhibaina.com/'
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 获取本地地址 
const setImgSrc = () => {
  return getOpenImg().then(res => {
    const tapIndex = res.tapIndex
    if (tapIndex === 0) {
      getImgSrc('camera').then(resSrc => {
        return getHttpsImgSrc(resSrc)
      })
    } else if (tapIndex === 1) {
      return getImgSrc('album').then(resSrc => {
        return getHttpsImgSrc(resSrc)
      })
    }
  })
}
const getOpenImg = () => {
  return new Promise((resolve, reject) => {
    wx.showActionSheet({
      itemList: ['拍照', '从相册选取'],
      success: (res) => {
        resolve(res)
      }
    })
  })
}
const getImgSrc = (type) => {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: 1, // 默认9
      sourceType: [type], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        resolve(res.tempFilePaths[0]);
      }
    })
  })
}

const getHttpsImgSrc = (resSrc) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${httpsUrl}api/common/fileUpload`, //仅为示例，非真实的接口地址
      filePath: resSrc,
      name: 'file',
      formData: {
        method: 'POST'
      },
      success(res) {
        const data = res.data
        resolve(`${JSON.parse(data).data}`)
      },
      fail (error) {
        console.log(error)
      }
    })
  })
}
//将wx的callback形式的API转换成支持Promise的形式
const promisify = (api) => {
  return (options, ...params) => {
    return new Promise((resolve, reject) => {
      const extras = {
        success: resolve,
        fail: reject
      }
      api({ ...options, ...extras }, ...params)
    })
  }
}
// 海报屏幕适配函数封装
const createRpx2px = () => {
  const { windowWidth } = wx.getSystemInfoSync()
  return function(rpx) {
    return windowWidth / 750 * rpx
  }
}
module.exports = {
  formatTime,
  setImgSrc,
  promisify,
  createRpx2px
}