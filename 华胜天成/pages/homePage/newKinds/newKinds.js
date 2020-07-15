// pages/homePage/newKinds/newKinds.js
const app = getApp()
Page({
  data: {
    newKind:[],
    tabbarIndex:1
  },
  onLoad(options){
    this.setData({
      tabbarIndex:options.index
    })
   this.getNewCategory()
  },
  //改变选择分类
  changeTabbar(e){
    const index = e.currentTarget.dataset.index
    this.setData({
      tabbarIndex:index
    })
  },
  //保存改变分类
  choose_btn_ok(){
    const tabbarIndex = this.data.tabbarIndex
    wx.setStorageSync('index', tabbarIndex)
    wx.navigateBack({
      delta:1
    })
  },
  //获取新闻分类
  getNewCategory(){
    app.severApi({
      url:'homepage/category'
    }).then(({data}) => {
      //console.log(data)    
      this.setData({
        newKind:data,
      })     
    })
  },
})