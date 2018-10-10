
/***************************  FIREBASE DEPENDENCIES ENDS ***************************/
var async = require('async');
var moment = require('moment');
var userIds = [];
/*-----------Add data in content table-----------*/
var fs = require("fs");
var products = {};



var p_ids = [];



// async.eachOf(d, function (con, con_key, con_cb){
//     console.log("ConKey--->",con_key)
//     con_cb();
// },function(err){
//     console.log("complete level 1 ...");
// });

// firestore.collection('productRelatedContent').doc(con_key).set({},{merge:true}).then(()=> {
//     console.log("Collection Added--->", con_key)
//     con_cb();
//   }).catch(function (error) {
//     console.log("Error in add collection : ", error);
// })

/* --------------------------- Get User List From Quiz Result For Admin --------------------------- */
// var userData = {}

// firestore.collection("quizResult").get().then((userList)=> {
//     userList.forEach((user) => {
//         // console.log("pId--->",user.id)
//         userData[user.id] = {}
//     });
//     // console.log("Userdata--->",userData)
//     async.eachOf(userData, function(user, user_key, user_cb ){
//         // console.log(user_key)
//         firestore.doc("user/"+user_key).get().then((userDet) => {
//             // console.log("Userdatils--->",userDet.data())
//             userData[user_key] = userDet.data();
//             user_cb();
//         }).catch(function(error){
//             console.log("Error in get user details..")
//         })
//     },function(err){
//         console.log("Userdetails-->",userData)
//         console.log("Complete level 1...")
//     })
// }).catch(function(error){
//     console.log("Error :", error)
// })



/* --------------------------- Get User Quiz Result For Admin --------------------------- */
var productUpdate = {}
firestore.doc('quizResult/zpuRPKWrBQamLTfkyzgemQeQoxy2').get().then((response) => {
    // console.log("Collection Added--->", JSON.stringify(response.data()))
    productUpdate = response.data()
    console.log("Product-->", productUpdate)
    async.eachOf(productUpdate.questionProduct, function (pu, pu_key, pu_cb) {
        // console.log("PUKey--->", pu_key)
        // console.log("Pu------>", pu.product)
        productId = pu.product;
        pu["prodDet"] = []
        async.each(productId, function (pId, productId_cb) {
            // console.log("PID--->",pId)
            firestore.doc("product/"+pId).get().then((prodDet) => {
                // console.log("Proddet--"+pId,"-->",prodDet.data())
                var prodDetails = prodDet.data()
                // prodDetails.pId = pId
                // console.log("PU---.",prodDetails.pId)
                if(prodDetails.pId == undefined){
                    prodDetails.pId = pId
                    pu["prodDet"].push(prodDetails)
                }else{
                    pu["prodDet"].push(prodDetails)
                }
                productId_cb();
            }).catch(function (error) {
                console.log("Error in get product details from quiz result : ", error);
            })
            
        }, function () {
            pu_cb();
        })
    }, function (err) {
        // console.log("Product-->", JSON.stringify(productUpdate))
        console.log(productUpdate)
        console.log("complete level 1 ...");
    });
    // console.log("Product-->", productUpdate)
}).catch(function (error) {
    console.log("Error in get quiz result : ", error);
})

/* --------------------------- Upload Image --------------------------- */
// var product = {}
// var config = {
//     projectId: 'kult-2',
//     keyFilename: '../serviceAccountKey.json'
// }
// var errorId = [];
// // var gcloud = require('gcloud');
// const { Storage } = require('@google-cloud/storage');
// // var storage = gcloud.storage(config);
// const storage = new Storage(config)
// storage.interceptors.push({
//     request: function(reqOpts) {
//         reqOpts.forever = false;
//         return reqOpts
//     }
//   });
// var { Writable } = require("stream");
// // var request = require("request");
// const request = require('request').defaults({
//     timeout: 500000,
//     forever: false,
//     pool: {
//         maxSockets: Infinity
//     }
// });
// var bucket = storage.bucket("kult-2.appspot.com")

// firestore.collection('product').get().then((productList) => {
//     //set it's status to registered if its pending
//     productList.forEach((products) => {
//         // console.log("pId--->",products.id)
//         product[products.id] = {}
//     });
//     // console.log(product)
//     async.eachOfLimit(product, 1, function (prd, prd_key, prd_cb) {
//         // console.log("ConKey--->", prd_key)
//         firestore.collection('product/' + prd_key + '/type').get().then((typeList) => {
//             //set it's status to registered if its pending
//             product[prd_key]["type"] = {}
//             typeList.forEach((type) => {
//                 // console.log("pId--->",prd_key)
//                 product[prd_key]["type"][type.id] = type.data()
//             });
//             async.eachOf(product[prd_key]["type"], function (typ, typ_key, typ_cb) {
//                 // if (prd_key <= 100) {
//                     async.waterfall([
//                         function (callback) {
//                             // console.log("Function1")
//                             if (typ.pTypeColor != '' && typ.pTypeColor != undefined) {
//                                 // console.log("pidup-->",prd_key)
//                                 file_download(typ.pTypeColor, prd_key, function (data) {
//                                     // console.log('data : ', data);
//                                     let fileExt = typ.pTypeColor.substring(typ.pTypeColor.lastIndexOf("."), typ.pTypeColor.length);
//                                     const file = bucket.file("productVariants/" + prd_key + "/" + typ_key + "/sImage" + fileExt);
//                                     const stream = file.createWriteStream({
//                                         validation: 'md5', resumable: false,
//                                         metadata: {
//                                             cacheControl: 'public, max-age=31536000',
//                                           },
//                                     }).on('error stream up', (err) => {
//                                         console.log("err : ", err);
//                                     }).on('finish', (response) => {
//                                     }).end(data);
//                                     return file.getSignedUrl({
//                                         action: 'read',
//                                         expires: '03-09-2491'
//                                     }).then(signedUrls => {
//                                         // console.log("Url--->", signedUrls[0])
//                                         firestore.doc('product/' + prd_key + '/type/' + typ_key).set({
//                                             pTypeColorCloud: signedUrls[0]
//                                         }, { merge: true }).then(function (r) {
//                                             // console.log("r : ", r);
//                                             // console.log("r : ", 'product/' + prd_key + '/type/' + typ_key);
//                                             callback();
//                                         }).catch(function (e) {
//                                             console.log("error write firebase up : ", e);
//                                             callback();
//                                         })
//                                     });
//                                 })

//                             } else {
//                                 firestore.doc('product/' + prd_key + '/type/' + typ_key).set({
//                                     pTypeColorCloud: ''
//                                 }, { merge: true }).then(function (r) {
//                                     // console.log("r : ", r);
//                                     callback();
//                                 }).catch(function (e) {
//                                     console.log("error write else up : ", e);
//                                     callback();
//                                 })
//                             }
//                         },
//                         function (callback) {
//                             // console.log("Function2")
//                             if (typ.pTypeImgLink != '' && typ.pTypeImgLink != undefined) {
//                                 // console.log("piddown-->",prd_key)
//                                 file_download(typ.pTypeImgLink, prd_key, function (data) {
//                                     // console.log('data : ', data);
//                                     let fileExt = typ.pTypeImgLink.substring(typ.pTypeImgLink.lastIndexOf("."), typ.pTypeImgLink.length);
//                                     // var bucket = storage.bucket("kult-2.appspot.com")
//                                     const file = bucket.file("productVariants/" + prd_key + "/" + typ_key + "/pImage" + fileExt);
//                                     const stream = file.createWriteStream({
//                                         validation: 'md5', resumable: false,
//                                         metadata: {
//                                             cacheControl: 'public, max-age=31536000',
//                                           },
//                                     }).on('error', (err) => {
//                                         console.log("error down stream : ", err);
//                                     }).on('finish', (response) => {
//                                     }).end(data);
//                                     return file.getSignedUrl({
//                                         action: 'read',
//                                         expires: '03-09-2491'
//                                     }).then(signedUrls => {
//                                         // console.log("Url--->", signedUrls[0])
//                                         firestore.doc('product/' + prd_key + '/type/' + typ_key).set({
//                                             pTypeImgCloudLink: signedUrls[0]
//                                         }, { merge: true }).then(function (r) {
//                                             // console.log("r : ", r);
//                                             // console.log("r : ", 'product/' + prd_key + '/type/' + typ_key);
//                                             callback();
//                                         }).catch(function (e) {
//                                             console.log("error write firestore down : ", e);
//                                             callback();
//                                         })
//                                     });
//                                 })
//                             } else {
//                                 firestore.doc('product/' + prd_key + '/type/' + typ_key).set({
//                                     pTypeImgCloudLink: ''
//                                 }, { merge: true }).then(function (r) {
//                                     // console.log("r : ", r);
//                                     callback();
//                                 }).catch(function (e) {
//                                     console.log("error write firestore else down : ", e);
//                                     callback();
//                                 })
//                             }

//                         },

//                     ], function (err, result) {
//                         // console.log("Result", result)
//                         typ_cb();
//                     })
//                 // }
//             }, function (err) {
//                 prd_cb();
//                 console.log("Complete Level 2...")
//             })
//         })
//     }, function (err) {
//         console.log("complete level 1 ...");
//     });

// });


// function file_download(url, id, cb) {
//     console.log("URL--->", id + "--" + url)
//     var final_chunk = "";
//     var buffer_arr = [];
//     var outStream = new Writable({
//         write(chunk, encoding, callback) {
//             var new_buf = Buffer.from(chunk);
//             buffer_arr.push(new_buf);
//             callback();
//         }
//     });
//     request(url).on('error', function (err) {
//         console.log("Error-->", id, "--", err)
//     }).pipe(outStream);
//     outStream.on("finish", function () {
//         // console.log("finish write", Buffer.concat(buffer_arr));
//         cb(Buffer.concat(buffer_arr));
//     })
// }


/* --------------------------- End Upload Image --------------------------- */

/* --------------------------- Add Quiz Result In Database --------------------------- */
// var quizResult = JSON.parse(fs.readFileSync('./quizResult.json', 'utf8'));
// var TempResult = [];

// console.log("quizResult---->", quizResult)
// for (var i = 0; i < items.length; i++)
// if (items[i].id && items[i].id === "animal") { 
//     items.splice(i, 1);
//     break;
// }

// async.eachOf(quizResult, function (QR, QR_key, QR_cb) {
//     // console.log("ConKey--->",typeof QR.products)
//     var QRPROD = QR.products
//     QR.products = []
//     // console.log(QRPROD.length)
//     // var QRPROD = QR.products
//     for (var i = 0; i < QRPROD.length; i++)
//     if (i < 2) {
//         // console.log(JSON.stringify(QRPROD[i]))
//         QR.products.push(QRPROD[i])
//     }
//     TempResult.push(QR)
//     QR_cb();
// }, function (err) {
//     console.log(JSON.stringify(TempResult))
//     console.log("complete level 1 ...");
// });

/* --------------------------- Set Ques Ans For Display In Admin Side ---------------------------*/
// var final_ques_ans = {"final_ques_ans":{"What is your name?":["TEst"],"What is your age?":["50+"],"What are your skin concerns? (Max 3 can be selected)":["Uneven Skin Tone","Blackheads","Acne"],"What are you looking for today?":["Makeup","Skincare"],"Which product are you looking for today?":["FACE MASKS","CONCEALER"],"My skin tones most resembles:":"Medium Deep","What kind of coverage?":"Medium","What kind of finish?":"Radiant","Mostly my forehead and cheeks appear:":"Shiny or Oily","Before applying moisturizer my T-zone feels oily:":"Always","Two to three hours after washing face, but not applying any moisturizer, Sunscreen, or other products, my forehead and cheeks feel":"Oily","Skincare moisturizers, makeup, and cleansers cause my face to break out (pimples), itch, or burn:":"Always","I have facial acne/pimples:":"Always","I develop red spots or discoloration after pimples:":"Always","I have some dark spots and dark patches on my face that don't match the rest of my face tone:":"Yes, its noticable from a distance","The air pollution ☁️ where I live is:":"I don't know","I notice some wrinkles and fine lines on my face":"Deep wrinkles and fine lines at rest"},"uid":"zpuRPKWrBQamLTfkyzgemQeQoxy2","skin_acronym":"OSPW"}

//     firestore.doc('quizResult/'+final_ques_ans.uid).set({
//         final_ques_ans:final_ques_ans.final_ques_ans
//     }, { merge: true }).then(() => {
//         console.log("Done")
//     }).catch(function (error) {
//         console.log("Error in add collection : ", error);
//     })


/*---------------------------- Update Referal Cashback status ----------------------------*/

// firestore.collection('referInvitation').where('contact_detail', '==', "reg@reg.com").get().then((invitationList) => {
//     //set it's status to registered if its pending
//     invitationList.forEach((currentInvitation) => {
//         console.log('Processing email referral: ', JSON.stringify(currentInvitation.data()));
//         firestore.collection('referInvitation').doc(currentInvitation.id).set({
//             'cbStatus': 'registered',
//         }, { merge: true });
//     });
// });

/*---------------------------- Add cashback status false in referInvitation table ----------------------------*/

// var referId = []

// firestore.collection('referInvitation').get().then((referUserList) => {
//     referUserList.forEach((referUser) => {
//         referId.push(referUser.id)
//     })
//     // console.log("ReferId-->",referId)
//     async.each(referId, function(rid, ref_cb) {
//         console.log("reid----.",rid)
//         firestore.doc('referInvitation/'+rid).set({cbStatus:'FALSE'}, { merge: true }).then(() => {
//             ref_cb();
//           })
//     },function(err){

//     })
// }).catch(function (error) {
//     console.log("Error in add collection : ", error);
// })


/*---------------------------- Get User That Have Referal code ----------------------------*/
// var userData = {}
// var referUserData = {};
// var orderList = {};

// firestore.collection('user').get().then((userList) => {
//     userList.forEach((user) => {
//         if (user.data().referEarnCode != undefined) {
//             // userData[user.id] = 
//             userData[user.id] = user.data();
//         }
//     });
//     // console.log(userData)
//     async.eachOf(userData, function (user, user_key, user_cb) {
//         firestore.collection('referInvitation').where('uid', '==', user_key).get().then((referUserList) => {
//             referUserList.forEach((referUser) => {
//                 if (referUser.data().status != "pending")
//                     // console.log(referUser.data())
//                     referUserData[referUser.data().contact_detail] = referUser.data()
//                 // referUserData[referUser.data().contact_detail] = referUser.data()
//                 // referUserData[referUser.data().contact_detail] = {"data":referUser.data(),"referalUid":user_key};
//             })
//             user_cb();
//         }).catch(function (error) {
//             console.log("Error in add collection : ", error);
//         })
//     }, function (err) {
//         async.eachOf(referUserData, function (rud, rud_key, rud_cb) {
//             firestore.collection("userCashback").doc(rud_key).collection("orderId").get().then((queryOrders) => {
//                 if (queryOrders.size != 0) {
//                     queryOrders.forEach((orders) => {
//                         if (orderList[rud.uid]) {
//                             orderList[rud.uid][orders.id] = { "orderData": orders.data(), "userData": userData[rud.uid], "referData": referUserData[orders.data().detail.sub_id] };
//                         } else {
//                             orderList[rud.uid] = {}
//                             orderList[rud.uid][orders.id] = { "orderData": orders.data(), "userData": userData[rud.uid], "referData": referUserData[orders.data().detail.sub_id] };
//                         }
//                     })
//                 }
//                 rud_cb();
//             }).catch(function (error) {
//                 console.log("Error in add collection : ", error);
//             })
//         }, function (err) {
//             console.log("OrderList-->", orderList)
//             // fs.writeFile("/home/mayur.b/Documents/Documents/Project/Kult/Dev_Doc/registerUserOrder.txt", JSON.stringify(orderList), function (err) {
//             //     console.log("err : ", err);
//             // })
//             // user_cb();
//             // console.log("Rud--->",userData)
//             console.log("complete level 2 ...");
//         });
//         // console.log("Rud--->",orderList)
//         // console.log("ReferUserData--->",Object.keys(referUserData))
//         console.log("complete level 1 ...");
//     });
// }).catch(function (error) {
//     console.log("Error in add Link : ", error);
// })




/*---------------------------- Get Referal Invitation ----------------------------*/

// firestore.collection('referInvitation').where('uid', '==', "WJ46yTTgacTkcQaMuwhfFGPrCBr2").get().then((invitationList) => {
//     invitationList.forEach((currentInvitation) => {
//         console.log('Processing email referral: ', JSON.stringify(currentInvitation.data()));
//         console.log('Processing email referral: ', currentInvitation.id);
//     });
// }).catch(function (error) {
//     console.log("Error in add Link : ", error);
// })




// var p_ref = firestore.collection("product").where("pBasicDetail", "==", {});
//     p_ref.get().then(function(r) {
//         r.forEach( (d) => { p_ids.push(d.id); } )
//         console.log("PID--->",p_ids) 
//     })




// firestore.collection("product").get().then(function(r) {
//     r.forEach( (d) => { 
//         // p_ids.push(d.data()); 
//         products[d.id]=d.data()
//     })
//     // console.log("PID--->",products)
//     fs.writeFile("/home/mayur.b/Documents/Documents/Project/Kult/Dev_Doc/Product.json", JSON.stringify(products), function(err) {
//         console.log("err : ", err);
//         })
// })

// firestore.collection("product").get().then(function(r) {
//     r.forEach( (d) => { 
//         // p_ids.push(d.data()); 
//         products[d.id]=d.data()
//     })
//     console.log("PID--->",products)
//     async.eachOfLimit(products ,1,function(pd, pd_key, pd_cb){
//         // console.log("PDKEY--->",pd)
//         if(pd.pBasicDetails == undefined){
//             p_ids.push(pd_key)
//         }
//         pd_cb();
//     },function(err){
//         console.log("PID--->",p_ids)
//         console.log("Finish...")
//     })
// })

// firestore.collection("product").get().then(function(r) {
//     r.forEach( (d) => { 
//         // p_ids.push(d.data()); 
//         products[d.id]=d.data()
//         if(d.data().pBasicDetail && d.data().pBasicDetail.pBrand){

//         }else{
//             p_ids.push(d.id)
//         }
//     })
//     console.log("PID--->",p_ids)
// })


/*---------------------------------Get Video Content Details---------------------------------*/
// var categoryData = {}
// var count = 0
// let dataSend = {}
// firestore.doc('product/929').get().then((categoryInfo) => { 
//     console.log("skinProfile",categoryInfo.data().categoryInfo)
//     this.categoryData = categoryInfo.data().categoryInfo
//     // console.log(this.categoryData)
//     if(this.categoryData != undefined || this.categoryData != null){
//         async.eachOf(this.categoryData ,function(cat, cat_key, cat_cb){
//             // console.log("Category-->",cat.category)
//             // console.log("Option---->",cat.shopOption)
//             firestore.collection('productRelatedVideoContent/'+ cat.shopOption + '/category/' + cat.category + '/link/').get().then((videoContentDetails) => {
//                 // console.log("ConatentDetails--->",contentDetails)
//                 videoContentDetails.forEach(function(e){
//                     console.log("Id--->",e.id)
//                     console.log("Data--->",e.data())
//                     console.log("Count--->",count)
//                     // dataSend[count] = e.data();
//                     count++;

//                 })
//                 cat_cb();
//             })

//         },function(err){
//             console.log("DataSend--->",dataSend)
//             console.log("complete level 1 ...");
//         })
//     }else{

//     }
//     // categoryInfo.forEach(function(e){
//     //   console.log("Id--->",e.id)
//     //   console.log("Data--->",e.data())
//     //   dataSend[e.id] = e.data();
//     // })
// })




/*---------------------Add Video Content Details To Database--------------------- */
// var d = JSON.parse(fs.readFileSync('./video_content_data.json', 'utf8'));
// var contentData = JSON.stringify(d, "", 4);
// async.eachOf(d, function (con, con_key, con_cb) {
//     // console.log("ConKey--->", con_key)

//     firestore.collection('productRelatedVideoContent').doc(con_key).set({}, { merge: true }).then(() => {
//         // console.log("Collection Added--->", con_key)

//         async.eachOf(d[con_key]["category"], function (cat, cat_key, cat_cb) {
//             // console.log("Cat Key--->", cat_key)

//             firestore.collection('productRelatedVideoContent/' +con_key+ '/category/').doc(cat_key).set({},{merge:true}).then(()=> {
//                 // console.log("Category Added--->", cat_key)

//                 async.eachOf(d[con_key]["category"][cat_key]["link"], function (link, link_key, link_cb){
//                     // console.log("ConKey--->",link_key)
//                     // console.log("ConKey--->",link)

//                     firestore.collection('productRelatedVideoContent/' +con_key+ '/category/' + cat_key+ '/link/').doc(link_key).set({
//                         video:link.video,
//                         image:link.image
//                     },{merge:true}).then(()=> {
//                         // console.log("Collection Added--->", con_key)
//                         link_cb();
//                       }).catch(function (error) {
//                         console.log("Error in add Link : ", error);
//                     })

//                 },function(err){
//                     cat_cb();
//                     console.log("complete level 1 ...");
//                 });

//               }).catch(function (error) {
//                 console.log("Error in add Category : ", error);
//             })

//         }, function (err) {
//             console.log("complete level 2 ...");
//             con_cb();
//         });

//     }).catch(function (error) {
//         console.log("Error in add Main cate : ", error);
//     })
// }, function (err) {
//     console.log("complete level 1 ...");
// });

/*---------------------------------Get Other Content Details---------------------------------*/
// var categoryData = {}
// var count = 0
// let dataSend = {}
// firestore.doc('product/945').get().then((categoryInfo) => { 
//     console.log("skinProfile",categoryInfo.data().categoryInfo)
//     this.categoryData = categoryInfo.data().categoryInfo
//     // console.log(this.categoryData)
//     if(this.categoryData != undefined || this.categoryData != null){
//         async.eachOf(this.categoryData ,function(cat, cat_key, cat_cb){
//             // console.log("Category-->",cat.category)
//             // console.log("Option---->",cat.shopOption)
//             firestore.collection('productRelatedContent/'+ cat.shopOption + '/category/' + cat.category + '/link/').get().then((contentDetails) => {
//                 // console.log("ConatentDetails--->",contentDetails)
//                 contentDetails.forEach(function(e){
//                     // console.log("Id--->",e.id)
//                     // console.log("Data--->",e.data())
//                     // console.log("Count--->",count)
//                     dataSend[count] = e.data();
//                     count++;

//                 })
//                 cat_cb();
//             })

//         },function(err){
//             console.log("DataSend--->",dataSend)
//             console.log("complete level 1 ...");
//         })
//     }else{

//     }
//     // categoryInfo.forEach(function(e){
//     //   console.log("Id--->",e.id)
//     //   console.log("Data--->",e.data())
//     //   dataSend[e.id] = e.data();
//     // })
// })


/*---------------------Add Other Content Details To Database--------------------- */
// var d = JSON.parse(fs.readFileSync('./content_data.json', 'utf8'));
// var contentData = JSON.stringify(d, "", 4);
// async.eachOf(d, function (con, con_key, con_cb) {
//     // console.log("ConKey--->", con_key)

//     firestore.collection('productRelatedContent').doc(con_key).set({}, { merge: true }).then(() => {
//         // console.log("Collection Added--->", con_key)

//         async.eachOf(d[con_key]["category"], function (cat, cat_key, cat_cb) {
//             // console.log("Cat Key--->", cat_key)

//             firestore.collection('productRelatedContent/' +con_key+ '/category/').doc(cat_key).set({},{merge:true}).then(()=> {
//                 // console.log("Category Added--->", cat_key)

//                 async.eachOf(d[con_key]["category"][cat_key]["link"], function (link, link_key, link_cb){
//                     // console.log("ConKey--->",link_key)
//                     // console.log("ConKey--->",link)

//                     firestore.collection('productRelatedContent/' +con_key+ '/category/' + cat_key+ '/link/').doc(link_key).set({
//                         video:link.video,
//                         image:link.image
//                     },{merge:true}).then(()=> {
//                         // console.log("Collection Added--->", con_key)
//                         link_cb();
//                       }).catch(function (error) {
//                         console.log("Error in add Link : ", error);
//                     })

//                 },function(err){
//                     cat_cb();
//                     console.log("complete level 1 ...");
//                 });

//               }).catch(function (error) {
//                 console.log("Error in add Category : ", error);
//             })

//         }, function (err) {
//             console.log("complete level 2 ...");
//             con_cb();
//         });

//     }).catch(function (error) {
//         console.log("Error in add Main cate : ", error);
//     })
// }, function (err) {
//     console.log("complete level 1 ...");
// });

//------------------------------------------------------------------------------------------------------

// async.eachOf(d, function (con, con_key, con_cb){
//     console.log("ConKey--->",con_key)
//     con_cb();
// },function(err){
//     console.log("complete level 1 ...");
// });

// firestore.collection('productRelatedContent').doc(con_key).set({},{merge:true}).then(()=> {
//     console.log("Collection Added--->", con_key)
//     con_cb();
//   }).catch(function (error) {
//     console.log("Error in add collection : ", error);
// })



/*---------------------Read Missing cashback details--------------------- */
// var finalData = {}

// firestore.collection('missingCashBackTicket/').get().then((userIdList) => {
//     userIdList.forEach(function(e){
//     //   console.log("Id--->",e.id)
//     // console.log("Data--->",e.data())
//     //   userIds.push(e.id)
//     finalData[e.id] = {}
//     })
//     console.log("skinProfile",finalData)
//     async.eachOf(finalData, function(fd,fd_key, callback){
//         // console.log('Processing file ' + fd_key);
//         firestore.collection('missingCashBackTicket/'+ fd_key + '/ticket').get().then((missingData) =>{
//             missingData.forEach(function(e){
//                 console.log("Id--->", typeof e.id)
//                 // console.log("Data--->",ticketid)
//                 finalData[fd_key][e.id] = e.data()
//                 // dataSend[e.id] = e.data();
//             })
//             callback()
//         })
//     },function (err) {
//         console.log("FinalData--->",finalData)
//         console.log("error in cat4 : ", err);
//     })
// })
