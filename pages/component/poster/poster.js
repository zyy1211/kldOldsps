const app = getApp();
let http = require('../../../utils/request');
let Api = require('../../../utils/config');

Component({
  properties: {
    avater: { // 图片
      type: String,
      value: ''
    },
    productname: { // 名称
      type: String,
      value: '爱上对方可垃圾爱士大夫士大夫了进口商的房价来看是打飞机读书卡房价快速的连接福克斯的垃圾分类快递师傅看到了师傅监考老师大家啊分开了圣诞节阿卡丽事大家读书卡房间看到了时间爱福克斯的骄傲了山东矿机'
    },
    addr: { // 场馆地址
      type: String,
      value: ''
    },
    seTime: { // 场馆地址
      type: String,
      value: ''
    },
    // timeStar: { // 开始时间
    //   type: String,
    //   value: ''
    // },
    // timeEnd: { // 结束时间
    //   type: String,
    //   value: ''
    // },
    participantsNum: { // 总人数
      type: String,
      value: ''
    },
    activityId: { // id
      type: String,
      value: ''
    },
    uid: { // id
      type: String,
      value: ''
    },
  },

  data: {
    showpost: false,
    imgHeight: 0,
    getAvaterInfo: "" //二维码
  },
  /**组件的方法列表*/
  methods: {
    clickCanvas:function(e){
      let self = this;
      console.log(e.detail);
      let x = e.detail.x;
      let y = e.detail.y;
      if(x < 340 && x > 240 && y < 390 && y >340){
        self.saveShareImg();
      }
    },

    //下载产品图片
    getAvaterInfo: function () {
      wx.showLoading({
        title: '生成中...',
        mask: true,
      });
      let that = this;
      that.setData({
        showpost: true
      })
      let productImage = that.data.avater;
      if (productImage) {
        console.log(productImage);
        wx.downloadFile({
          url: productImage,
          success: function (res) {
            console.log(res);
            wx.hideLoading();
            if (res.statusCode === 200) {
              let productSrc = res.tempFilePath;
              that.calculateImg(productSrc, function (data) {
                that.getQrCode(productSrc, data);
              })
            } else {
              wx.showToast({
                title: '产品图片下载失败！',
                icon: 'none',
                duration: 2000,
                success: function () {
                  let productSrc = "";
                  that.getQrCode(productSrc);
                }
              })
            }
          },
          fail: function () {
            wx.hideLoading();
          },
          complete:function(){
            setTimeout(() => {  
              wx.hideLoading();  
            }, 100); 
          }
        })
      } else {
        wx.hideLoading();
        var productSrc = "";
        that.getQrCode(productSrc);
      }
    },

    scanSign:function(res){
      let that = this;
      wx.showLoading({
        title: '生成中...',
        mask: true,
      });
      that.setData({
        showpost: true,
        imgHeight:400
      })
      let scene = that.data.activityId + '-' + that.data.uid;
      http.post('/QRCode/getQRCode',{pagePath:'pages/signIn/signIn',scene:scene,width:300}).then(function (res) {
        console.log(res);
        // let codeSrc = 'data:image/jpeg;base64,' + res.data.message
        var productCode = res.data.message;
        // console.log(productCode);
        if (productCode) {
          wx.downloadFile({
            url: Api.img_host + productCode,
            success: function (res) {
              wx.hideLoading();
              if (res.statusCode === 200) {
                var codeSrc = res.tempFilePath;
                // console.log(codeSrc)
                that.scanSignCanvas(codeSrc);
              } else {
                wx.showToast({
                  title: '二维码下载失败！',
                  icon: 'none',
                  duration: 2000
                })
              }
            },
            fail: function () {
              wx.hideLoading();
            },
            complete:function(){
              setTimeout(() => {  
                wx.hideLoading();  
              }, 100); 
            }
          })
        } else {
          wx.hideLoading();
        }
      })
    },

    //下载二维码
    getQrCode: function (productSrc, imgInfo = "") {
      let that = this;
      wx.showLoading({
        title: '生成中...',
        mask: true,
      });

      // that.sharePosteCanvas(productSrc, '../../../images/qrcode.jpg', imgInfo);
      let pages = getCurrentPages() //获取加载的页面
      let currentPage = pages[pages.length - 1] //获取当前页面的对象
      let url = currentPage.route //当前页面url
      console.log(that.data.activityId)
      http.post('/QRCode/getQRCode',{pagePath:'pages/activityDetail/activityDetail',scene:that.data.activityId,width:280}).then(function (res) {
        console.log(res);
        // let codeSrc = 'data:image/jpeg;base64,' + res.data.message
        var productCode = res.data.message;
        console.log(productCode);
        if (productCode) {
          wx.downloadFile({
            url: Api.img_host + productCode,
            success: function (res) {
              wx.hideLoading();
              if (res.statusCode === 200) {
                var codeSrc = res.tempFilePath;
                that.sharePosteCanvas(productSrc, codeSrc, imgInfo);
              } else {
                wx.showToast({
                  title: '二维码下载失败！',
                  icon: 'none',
                  duration: 2000,
                  success: function () {
                    var codeSrc = "";
                    that.sharePosteCanvas(productSrc, codeSrc, imgInfo);
                  }
                })
              }
            },
            fail: function () {
              wx.hideLoading();
            },
            complete:function(){
              setTimeout(() => {  
                wx.hideLoading();  
              }, 100); 
            }
          })
        } else {
          wx.hideLoading();
          var codeSrc = "";
          that.sharePosteCanvas(productSrc, codeSrc);
        }
      })

    },
    scanSignCanvas:function(codeSrc){
      var that = this;
      wx.showLoading({
        title: '生成中...',
        mask: true,
      })
      const ctx = wx.createCanvasContext('myCanvas', that);
      const query = wx.createSelectorQuery().in(this);
      query.select('#canvas-container').boundingClientRect(function (rect) {
        let height = rect.height;
        let width = rect.width;
        let imgWidth = 280;
        let productname = that.data.productname;
        ctx.setFillStyle('#fff');
        ctx.fillRect(0, 0, width, height);
        ctx.setFillStyle('#F3F3F3')
        // 文案
        ctx.setTextAlign('left');
        ctx.setFillStyle('#000');
        ctx.setFontSize(16);
        ctx.fillText('栎刻动体育活动签到二维码!', 12, 40)
        //code
        if (codeSrc) {
          let wxy = (width - imgWidth) / 2;
          // console.log('drawing');
          ctx.drawImage(codeSrc, wxy, wxy + 60, imgWidth, imgWidth);
          ctx.setFontSize(14);
          ctx.setFillStyle('#fff');
          ctx.setTextAlign('left');

        }
      }).exec()
      setTimeout(function () {
        ctx.draw();
        wx.hideLoading();
      }, 1000)
    },
    //canvas绘制分享海报
    sharePosteCanvas: function (avaterSrc, codeSrc, imgInfo) {
      wx.showLoading({
        title: '生成中...',
        mask: true,
      })
      var that = this;
      let user = app.getUserInfo();
      const ctx = wx.createCanvasContext('myCanvas', that);
      var width = "";
      const query = wx.createSelectorQuery().in(this);
      query.select('#canvas-container').boundingClientRect(function (rect) {
        console.log(rect);
        let height = rect.height;
        width = rect.width;
        let left = rect.left;
        ctx.setFillStyle('#fff');
        ctx.fillRect(0, 0, rect.width, height);
        ctx.setFillStyle('#F3F3F3')
        ctx.fillRect(0, height - 100, rect.width, 100)
        ctx.moveTo(10, height - 100)
        ctx.lineTo(rect.width - 10, height - 100)
        ctx.strokeStyle = "#999";
        ctx.setLineDash([5, 5], 1)
        ctx.stroke();
        ctx.setFillStyle('#03C682');
        ctx.fillRect(rect.width - 110, height - 150, 90, 30)
        ctx.setFillStyle('#FFF');
        ctx.setFontSize(16);
        ctx.fillText('保存图片', rect.width - 95, height - 130)
        if (user == '') {
          ctx.setTextAlign('left');
          ctx.setFillStyle('#000');
          ctx.setFontSize(16);
          ctx.fillText('超级nice的活动，你还犹豫什么？', 12, 40)
        } else {
          let imgWidth = that.data.imgWidth;
          let wxy = (rect.width - imgWidth) / 2;
          wx.downloadFile({
            url: user.avatarUrl,
            success: function (res) {
              wx.hideLoading();
              if (res.statusCode === 200) {
                let productSrc = res.tempFilePath;
                ctx.drawImage(productSrc, wxy, 13, 43, 43);
              } else {
                wx.showToast({
                  title: '产品图片下载失败！',
                  icon: 'none',
                  duration: 2000
                })
              }
            },
            fail: function () {
              wx.hideLoading();
            },
            complete:function(){
              setTimeout(() => {  
                wx.hideLoading();  
              }, 100); 
            }
          })
          ctx.setTextAlign('left');
          ctx.setFillStyle('#000');
          ctx.setFontSize(15);
          ctx.fillText(user.nickName, 65, 30)
          ctx.setFontSize(13);
          ctx.setFillStyle('#666');
          ctx.fillText('超级nice的活动，你还犹豫什么？', 65, 50)
        }

        //banner
        if (avaterSrc) {
          if (imgInfo) {
            var imgheght = parseFloat(imgInfo);
          }
          let imgWidth = that.data.imgWidth;
          let wxy = (rect.width - imgWidth) / 2;
          console.log('drawing');
          ctx.drawImage(avaterSrc, wxy, wxy + 60, imgWidth, imgheght);
          // console.log(avaterSrc);
          // console.log(wxy);
          // console.log(imgWidth);
          // console.log(imgheght);
          ctx.setFontSize(14);
          ctx.setFillStyle('#fff');
          ctx.setTextAlign('left');

        }

        //活动名称
        if (that.data.productname) {
          let content = that.data.productname;
          let nameLength = content.length;

          if (nameLength > 20) {
            content = content.substr(0, 18) + '...'
          }
          ctx.setTextAlign('left');
          ctx.setFillStyle('#000');
          ctx.setFontSize(15);
          ctx.fillText(content, 12, imgheght + 90)
        }
        // 时间
        if (that.data.seTime) {
          let content = '时间：' + that.data.seTime ;
          ctx.setTextAlign('left');
          ctx.setFillStyle('#333');
          ctx.setFontSize(13);
          ctx.fillText(content, 12, imgheght + 115)
        }
        // 地址
        if (that.data.addr) {
          let content = '地址：' + that.data.addr;
          let nameLength = content.length;
          if (nameLength > 20) {
            content = content.substr(0, 18) + '...'
          }
          ctx.setTextAlign('left');
          ctx.setFillStyle('#333');
          ctx.setFontSize(13);
          ctx.fillText(content, 12, imgheght + 140)
        }
        // 人数
        if (that.data.participantsNum) {
          let content = '人数：' + that.data.participantsNum;
          ctx.setTextAlign('left');
          ctx.setFillStyle('#333');
          ctx.setFontSize(13);
          ctx.fillText(content, 12, imgheght + 165)
        }

        //  绘制二维码
        if (codeSrc) {
          ctx.drawImage(codeSrc, 13, imgheght + 210, 70, 70)
          let con1 = '长按二维码';
          let con2 = '查看活动详情'
          ctx.setTextAlign('left');
          ctx.setFillStyle('#999');
          ctx.setFontSize(13);
          ctx.fillText(con1, 100, imgheght + 235)
          ctx.fillText(con2, 100, imgheght + 260)
          ctx.drawImage('/static/newlogo.png', that.data.imgWidth - 40, imgheght + 215, 45, 53)
        }
      }).exec()
      setTimeout(function () {
        ctx.draw();
        wx.hideLoading();
      }, 1000)

    },

    // 封装每行显示的文本字数
    textByteLength(text, num) { // text为传入的文本  num为单行显示的字节长度
      let strLength = 0;
      let rows = 1;
      let str = 0;
      let arr = [];
      for (let j = 0; j < text.length; j++) {
        if (text.charCodeAt(j) > 255) {
          strLength += 2;
          if (strLength > rows * num) {
            strLength++;
            arr.push(text.slice(str, j));
            str = j;

            rows++;
          }
        } else {
          strLength++;
          if (strLength > rows * num) {
            arr.push(text.slice(str, j));
            str = j;
            rows++;
          }
        }
      }
      arr.push(text.slice(str, text.length));
      return [strLength, arr, rows] //  [处理文字的总字节长度，每行显示内容的数组，行数]
    },

    // 点击保存到相册
    saveShareImg: function () {
      var that = this;
      wx.showLoading({
        title: '正在保存',
        mask: true,
      })
      setTimeout(function () {
        wx.canvasToTempFilePath({
          canvasId: 'myCanvas',
          success: function (res) {
            var tempFilePath = res.tempFilePath;
            wx.saveImageToPhotosAlbum({
              filePath: tempFilePath,
              success(res) {
                wx.hideLoading()
                wx.showModal({
                  content: '图片已保存到相册，赶紧晒一下吧~',
                  showCancel: false,
                  confirmText: '好的',
                  confirmColor: '#333',
                  success: function (res) {
                    that.closePoste();
                  }
                })
              },
              fail: function (res) {
                wx.showToast({
                  title: '保存失败',
                  icon: 'none'
                })
              },
              complete:function(){
                setTimeout(() => {  
                  wx.hideLoading();  
                }, 100); 
              }
            })
          }
        }, that);
      }, 1000);
    },

    //关闭海报
    closePoste: function () {
      this.setData({
        showpost: false
      });
    },

    //计算图片尺寸
    calculateImg: function (src, cb) {
      var that = this;
      wx.getImageInfo({
        src: src,
        success(res) {
          console.log(res)
          wx.getSystemInfo({
            success(res2) {
              console.log(res2)
              let ratio = res.width / res.height;
              let imgWidth = res2.windowWidth * 0.85;
              let imgHeight = imgWidth / ratio + 295;
              // let imgHeight = (res2.windowWidth * 0.65) + 130;
              that.setData({
                imgWidth: imgWidth,
                imgHeight: imgHeight
              })
              cb(imgHeight - 295);
            }
          })
        }
      })
    }
  },

  ready: function () {

  }
})