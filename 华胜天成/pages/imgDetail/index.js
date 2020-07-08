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
      index: options.index
    })
    const index = options.index
    app.severApi({
      url: 'homepage/banner'
    }).then(({data}) => {
      console.log(data)
      this.setData({
        newsImg: `https://hhh.juzhibaina.com/${data[index].img.replace(/\\/g,"/")}`,
        title: data[index].title
      })
      WxParse.wxParse('article', 'html', data[index].desc, this, 5)
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
        new_id: options.new_id,
        share_tourist_id: options.new_id
      }
    }).then((res) => {
      console.log(res)
    })
    if (options.from == 'button') {
      let url = '/pages/shareNew/index?new_id=' + this.data.new_id
      return {
        title: "华胜天成-新闻",
        path: url,
        imageUrl: this.data.newsImg
      }
    }

  }
})