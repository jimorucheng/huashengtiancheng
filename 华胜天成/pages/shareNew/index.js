// pages/newDetail/index.js
const WxParse = require('../../wXparse/wxParse.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsImg: '',
    title: '',
    browse_num: '',
    shareModalShow: false,
    options: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      options: options
    })
    // if(wx.getStorageSync('tourist_id')){
    //   app.severApi({
    //     url: 'homepage/browse',
    //     data: {
    //       tourist_id: wx.getStorageSync('tourist_id'),
    //       new_id: options.new_id
    //     }
    //   }).then((res) => {
    //     console.log(res)
    //   })
    // }

    // 
    app.severApi({
      url: 'homepage/detail',
      data: {
        new_id: options.new_id
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        newsImg: `https://hhh.juzhibaina.com/${res.data.img.replace(/\\/g,"/")}`,
        title: res.data.title,
        browse_num: res.data.browse_num
      })
      WxParse.wxParse('article', 'html', res.data.desc, this, 5)
    })
  },
  //showModalShare
  showModalShare() {
    if (wx.getStorageSync('tourist_id')) {
      app.severApi({
        url: 'homepage/browse',
        data: {
          tourist_id: wx.getStorageSync('tourist_id'),
          new_id: this.data.options.new_id,
          share_tourist_id: this.data.options.share_tourist_id
        }
      }).then((res) => {
        wx.switchTab({
          url: '../homePage/index/index',
        })
      })     
    } else {
      wx.navigateTo({
        url: '../my/login/index',
      })
    }

  },
  hideShareModal() {
    this.setData({
      shareModalShow: false
    })
  }
})