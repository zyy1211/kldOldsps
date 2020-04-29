// pages/component/pst/pst.js
const app = getApp();
let Api = require('../../../utils/config')
let http = require('../../../utils/request');
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    imgHeight: '',
    imgWidth: '',
    imgLeft: '',
    showpost: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getPst: function () {
      let self = this;
      let venuCvs = app.getVenuCvs();

      self.setData({venuCvs})
      const ctx = wx.createCanvasContext('myCanvas', self);
      self.getBackground(ctx);

    },
    // 背景
    getBackground: function (ctx) {
      let self = this;
      wx.showLoading({
        title: '生成中...',
        mask: true,
      });
      self.setData({
        showpost: true
      })
      let background = Api.cvs_img + '/20200414/e423ab50b9273111fbf9b3560e45603b.png';
      // console.log(Api.cvs_img + '/20200414/e423ab50b9273111fbf9b3560e45603b.png')
      wx.getImageInfo({
        src: background,
        success: function (res) {
          wx.getSystemInfo({
            success(wind) {
              // let imgWidth = res.width / 2;
              // let imgHeight = res.height / 2;
              // let imgLeft = (wind.windowWidth - imgWidth) / 2;

              let imgLeft = 25;
              let imgWidth = wind.windowWidth - imgLeft * 2;
              let imgHeight = imgWidth * res.height / res.width;

              // console.log(imgLeft)
              self.setData({
                imgHeight,
                imgWidth,
                imgLeft
              })
              ctx.drawImage(res.path, 0, 0, imgWidth, imgHeight);
            }
          })
        },
        complete: function () {
          self.getInfo(ctx);

        }
      })
    },
    getCode: function (ctx) {
      let self = this;
      let {
        imgWidth,
        imgHeight,
        venuCvs
      } = this.data;
      let id = venuCvs.id;
      console.log(id);
      http.post('/QRCode/getQRCode', {
        pagePath: 'pages/venuesDetail/venuesDetail',
        scene: id,
        width: 280
      }).then(function (res) {
        if (res.data.status != 200) {
          return;
        }
        let code = res.data.message;
        wx.downloadFile({
          url: Api.img_host + code,
          success: function (res) {
            if (res.statusCode == 200) {
              let codeSrc = res.tempFilePath;
              wx.getImageInfo({
                src: codeSrc,
                success: function (res) {
                  console.log(res)
                  ctx.drawImage(res.path, imgWidth / 6, imgHeight / 3 * 2 + 16, 75, 75);
                  ctx.draw();
                },
                complete: function () {
                  // complete
                }
              })
              // self.scanSignCanvas(ctx,codeSrc);
            }
          }
        })
      })
    },

    getInfo: function (ctx) {
      let self = this;
      let {venuCvs} = this.data;
      console.log(venuCvs);
      let background = Api.img_host + venuCvs.imagesPath[0];
      let {
        imgLeft
      } = this.data;
      wx.getImageInfo({
        src: background,
        success: function (res) {
          let {
            imgHeight,
            imgWidth,
            imgLeft
          } = self.data;
          let width = 80;
          let sx = imgWidth / 2;
          let sy = 90;
          // 头像
          ctx.save()
          ctx.beginPath()
          ctx.arc(sx, sy, width / 2, 0, 2 * Math.PI)
          // ctx.setStrokeStyle('#333333')
          ctx.stroke()
          ctx.clip() //裁剪
          ctx.drawImage(res.path, sx - width / 2, sy - width / 2, width, width) //绘制图片
          ctx.restore() //恢复之前保存的绘图上下文
          // 文字
          let textbase = 160;
          self.setText({
            size: "14",
            align: "center",
            color: '#333',
            bold: true,
            text: venuCvs.sName,
            sx: sx,
            sy: textbase,
          }, ctx);
          self.setText({
            size: "12",
            align: "center",
            color: '#666',
            bold: false,
            text: venuCvs.sAddrDesc,
            sx: sx,
            sy: textbase + 30,
          }, ctx);
          self.setText({
            size: "12",
            align: "center",
            color: '#666',
            bold: false,
            text: venuCvs.contactPhone,
            sx: sx,
            sy: textbase + 50,
          }, ctx);

          // let {imgHeight} = this.data;
          // let {imgWidth} = this.data;
          // self.setText({
          //   size: "12",
          //   align: "center",
          //   color: '#fff',
          //   bold: false,
          //   text: '点击下载',
          //   sx: imgWidth / 3 - 15,
          //   sy: imgHeight - 7,
          // }, ctx);

          // self.setText({
          //   size: "12",
          //   align: "center",
          //   color: '#fff',
          //   bold: false,
          //   text: '微信好友',
          //   sx: imgWidth / 3 * 2 + 10,
          //   sy: imgHeight - 7,
          // }, ctx);



          self.setArr(venuCvs.facility.split(','), textbase, ctx);
          // ctx.draw();
        },
        complete:function(){
          self.getCode(ctx);
        }
      })
    },
    //关闭海报
    closePoste: function () {
      this.setData({
        showpost: false
      });
    },
    _touchmove: function () {},

    setArr: function (arr, textbase, ctx) {
      let self = this;
      let {
        imgWidth
      } = this.data;
      let basex = 50;
      let lineheight = 26;
      let bd_r = 6;
      let padding = 10
      let sx = basex + padding;
      arr.forEach(item => {

        let discountText = item;
        var linewidth = ctx.measureText(item).width + padding * 2;
        if (sx + linewidth > imgWidth - padding) {
          return;
        }
        console.log(imgWidth);
        self.setText({
          size: "11",
          align: "left",
          color: '#09C9A2',
          bold: false,
          text: item,
          sx: sx,
          sy: textbase + 88,
        }, ctx);


        self.roundRect({
          x: sx - padding,
          y: textbase + 70,
          w: linewidth,
          h: lineheight,
          r: bd_r,
          fillColor: 'transparent',
          strokeColor: '#09C9A2'
        }, ctx);
        sx = sx + linewidth + padding;
      })


    },

    setText: function (obj, ctx) {
      ctx.setFontSize(obj.size);
      ctx.setTextAlign(obj.align);
      ctx.setFillStyle(obj.color)
      if (obj.bold) {
        ctx.fillText(obj.text, obj.sx, obj.sy - 0.5)
        ctx.fillText(obj.text, obj.sx + 0.5, obj.sy)
      } else {
        // console.log(obj)
        ctx.fillText(obj.text, obj.sx, obj.sy)
      }
    },
    roundRect: function (obj, ctx) {

      ctx.beginPath();
      ctx.arc(obj.x + obj.r, obj.y + obj.r, obj.r, Math.PI, Math.PI * 1.5)
      ctx.moveTo(obj.x + obj.r, obj.y)
      ctx.lineTo(obj.x + obj.w - obj.r, obj.y)
      ctx.arc(obj.x + obj.w - obj.r, obj.y + obj.r, obj.r, Math.PI * 1.5, Math.PI * 2)
      ctx.lineTo(obj.x + obj.w, obj.y + obj.h - obj.r)
      ctx.arc(obj.x + obj.w - obj.r, obj.y + obj.h - obj.r, obj.r, 0, Math.PI * 0.5)
      ctx.lineTo(obj.x + obj.r, obj.y + obj.h)
      ctx.arc(obj.x + obj.r, obj.y + obj.h - obj.r, obj.r, Math.PI * 0.5, Math.PI)
      ctx.lineTo(obj.x, obj.y + obj.r)
      if (obj.fillColor) {
        console.log(obj.x);
        // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
        ctx.setFillStyle(obj.fillColor)
        // 对绘画区域填充
        ctx.fill()
        if (obj.strokeColor) {
          // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
          ctx.setStrokeStyle(obj.strokeColor)
          // 画出当前路径的边框
          ctx.stroke()
        }
      }
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
                console.log(res);
                wx.showToast({
                  title: '保存失败',
                  icon: 'none'
                })
              },
              complete: function () {
                setTimeout(() => {
                  wx.hideLoading();
                }, 100);
              }
            })
          }
        }, that);
      }, 1000);
    },
  }
})