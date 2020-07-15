// pages/news/messages/message.js
const app = getApp()
Page({

  data: {
    messageTitle: '',
    newsList: []
  },

  onLoad: function (options) {   
    this.getDetail(options)
  },
  getDetail() {
    app.severApi({
      url: 'homepage/notice',
      data: {
        per_page: 1000,
        page: 1
      }
    }).then((res) =>{
      console.log(res)
      const nerwArr = []
      for (const iterator of res.data.data) {
        nerwArr.push({
          title: iterator.title,
          message: iterator.desc.replace(/<p>/g,'test').replace(/<\/p>/g,'test'),
          time: iterator.updated_at
        })
      }
      this.setData({
        newsList: nerwArr
      })
    })
  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})