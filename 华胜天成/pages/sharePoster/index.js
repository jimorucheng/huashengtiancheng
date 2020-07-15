// pages/sharePoster/index.js
import {
  promisify,
  createRpx2px
} from '../../utils/util'
Page({
  data: {
    showSavePosterBtn: false,
    openStatus:false
  },
  onLoad(options) {
    this.drowPoster(options.newImg)
  },
  //canvas画海报
  drowPoster(newImg) {
    wx.showLoading({
      title: '海报生成中...',
    })
    const wxGetImageInfo = promisify(wx.getImageInfo)
    const rpx2px = createRpx2px()
    Promise.all([
      wxGetImageInfo({
        src: 'https://hhh.juzhibaina.com/banners/July2020/6qwoPKdktC5PixOgncoo.png'
      }),
      wxGetImageInfo({
        src: newImg
      }),
      wxGetImageInfo({
        src: 'https://hhh.juzhibaina.com/banners/July2020/6bymcnCLJDTU8uJvpwIh.png'
      })
    ]).then(res => {
      wx.hideLoading()
      this.setData({
        showSavePosterBtn: true
      })
      // console.log(res)
      const ctx = wx.createCanvasContext('shareCanvas')
      // 底图
      ctx.drawImage(res[0].path, 0, 0, rpx2px(520), rpx2px(894))
      //Logo图 
      ctx.save()
      ctx.beginPath()
      ctx.arc(rpx2px(110), rpx2px(90), rpx2px(50), 0, 2 * Math.PI)
      ctx.clip()
      ctx.drawImage('../../imgs/logo.png', rpx2px(60), rpx2px(40), rpx2px(100), rpx2px(100))
      ctx.restore()
      //小程序名称
      ctx.setFillStyle('#FFFFFF') // 文字颜色：白色
      ctx.setFontSize(rpx2px(48)) // 文字字号：24px
      ctx.fillText('华胜天成', rpx2px(222), rpx2px(106))
      //产品图片
      ctx.drawImage(res[1].path, rpx2px(110), rpx2px(216), rpx2px(300), rpx2px(300))
      ctx.restore()
      // 遮罩绘制
      ctx.setFillStyle('#FFFFFF')
      ctx.fillRect(0, rpx2px(734), rpx2px(520), rpx2px(160))
      ctx.restore()
      // 小程序码
      ctx.save()
      ctx.beginPath()
      ctx.arc(rpx2px(120), rpx2px(805), rpx2px(60), 0, 2 * Math.PI)
      ctx.clip()
      ctx.drawImage(res[2].path, rpx2px(60), rpx2px(745), rpx2px(120), rpx2px(120))
      ctx.restore()
      //小程序提示
      ctx.setFillStyle('#353535') // 文字颜色：黑色
      ctx.setFontSize(rpx2px(22)) // 文字字号：22px
      ctx.fillText('长按图片扫码，关注更多资讯', rpx2px(200), rpx2px(810))
      ctx.stroke()
      ctx.draw()
    }).catch(fail => {
      wx.hideLoading()
    })
  },
  //保存到相册
  savePoster() {
    const wxCanvasToTempFilePath = promisify(wx.canvasToTempFilePath)
    const wxSaveImageToPhotosAlbum = promisify(wx.saveImageToPhotosAlbum)
    wxCanvasToTempFilePath({
      canvasId: 'shareCanvas'
    }, this).then(res => {
      return wxSaveImageToPhotosAlbum({
        filePath: res.tempFilePath
      })
    }).then(res => {
      wx.showToast({
        title: '已保存到相册',
      })
    }).catch(err => {
      wx.showToast({
        title: '保存失败',
      })
    })
  },
})