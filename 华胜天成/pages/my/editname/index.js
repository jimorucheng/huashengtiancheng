// pages/my/editname/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getname (e) {
    this.setData({
      name: e.detail.value
    })
  },
  onsubmit () {
    if(this.data.name === '') {
      wx.showToast({
        title: '昵称不能为空！',
        icon: 'none'
      })
    }else {
      app.severApi({
        url: 'person/info',
        data: {
          tourist_id: wx.getStorageSync('tourist_id')
        }
      }).then(({data}) => {
        app.severApi({
          url: 'person/edit',
          data: {
            tourist_id: wx.getStorageSync('tourist_id'),
            avatar: data.avatar,
            nickName: this.data.name
          }
        }).then((res) => {
          if(res.code === 200) {
            console.log(res)
            const userInfo = wx.getStorageSync('userInfo')
            userInfo.nickName = this.data.name
            wx.setStorageSync('userInfo', userInfo)
            wx.showToast({
              title: '更改成功',
              success:(res) => {
                setTimeout(() =>{
                  wx.navigateBack({
                    delta:1
                  },1000)
                })
              }
            })          
          }
        }) 
      })
      
    }
  },
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