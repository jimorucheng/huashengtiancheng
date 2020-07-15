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
    new_id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      new_id: options.new_id
    })
    app.severApi({
      url: 'homepage/browse',
      data: {
        tourist_id: wx.getStorageSync('tourist_id'),
        new_id: options.new_id,
        share_tourist_id: options.new_id
      }
    }).then((res) => {
      console.log(res)
    })
    app.severApi({
      url: 'homepage/detail',
      data: {
        tourist_id: wx.getStorageSync('tourist_id'),
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
    this.setData({
      shareModalShow: true
    })
  },
  hideShareModal() {
    this.setData({
      shareModalShow: false
    })
  },

  onShareAppMessage(options) {
    app.severApi({
      url: 'homepage/share',
      data: {
        tourist_id: wx.getStorageSync('tourist_id'),
        new_id: this.data.new_id
      }
    }).then((res) => {
      console.log(res)
    })
    if (options.from == 'button') {
      let url = `/pages/shareNew/index?new_id=${ this.data.new_id}&share_tourist_id=${wx.getStorageSync('tourist_id')}`
      return {
        title: "华胜天成-新闻",
        path: url,
        imageUrl: this.data.newsImg
      }
    }  
  },
  //分享海报
  sharePoster(){
    const newImg = this.data.newsImg
    wx.navigateTo({
      url: `../sharePoster/index?newImg=${newImg}`,
    })
  }
})