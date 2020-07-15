// pages/homePage/searchRuselt/searchRuselt.js
const app = getApp()
Page({
  data: {
    headHeight: 0,        //计算头部高度
    inputValue:'',
    newList:[],
    page:1,
    per_page:'10',
    key_work:'',
    category_id:'',
    isMoreData: false,
    baseUrl:'https://hhh.juzhibaina.com/'
  },
  onLoad(){
    this.setData({
      headHeight: app.globalData.navHeight
    }); 
  },
  gotoNewDetial (e) {
    if (wx.getStorageSync('tourist_id')) {
      const new_id = e.currentTarget.dataset.new_id
      wx.navigateTo({
        url: `../../newDetail/index?new_id=${new_id}`,
      })
    } else {
      this.gotoLogin()
    }
  },
  //返回
  goBack(){
    wx.navigateBack({
      delta:1
    })
  },
  //删除
  deleteValue(){
    this.setData({
      inputValue:''
    })
  },
  //获取input的值
  getInputValue(e){
     this.setData({
      inputValue:e.detail.value
     })
  },
  gotoLogin () {
    wx.showModal({
      title: '提示',
      content: '未登录请先去登录！',
      confirmText:'去登录',
      cancelText: '取消',
      success: res=>{
        if(!res.cancel){
          wx.navigateTo({
            url: '../../my/login/index',
          })
        }
      }
    })
  },
  //获取分类列表
  getKindList(){
    const category_id = this.data.category_id
    const page = this.data.page
    const per_page = this.data.per_page
    const key_work = this.data.key_work
    app.severApi({
      url:'homepage/news',
      data:{
        category_id:category_id,
        page: 1,
        per_page:per_page * page,
        key_work:key_work
      }
    }).then(({data}) => {
      console.log(data)
      const dataList = []
      for (const iterator of data.data) {
        dataList.push({
          title: iterator.title,
          pic: `${this.data.baseUrl}${iterator.img.replace(/\\/g,"/")}`,
          time: iterator.updated_at.substr(0, 10),
          new_id: iterator.id
        })
      }
      this.setData({
        newList: dataList,
        isMoreData: data.total <= dataList.length
      })
    })
  },
  //获取点击软键盘搜索按钮
  bindconfirm(e) {
    const searchValue = e.detail.value['search - input'] ? e.detail.value['search - input'] : e.detail.value;
    if (searchValue == ''){
      wx.showToast({
        icon:'none',
        title: '搜索内容不能为空',
      })
    }else{
      this.setData({
        key_work:searchValue,
        page: 1
      })
      this.getKindList()
    }
  },
})