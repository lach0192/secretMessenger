/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    currentId: null,
    currentGuid: null,
    imageSend: null,
    imageReceive: null,
    currentMsgId: null,
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        document.getElementById("logBtn").addEventListener("touchstart", app.login);
        document.getElementById("regBtn").addEventListener("touchstart", app.register);
        document.getElementById("sendBtn").addEventListener("touchstart", app.toggleSendModal)
        document.getElementById("picBtn").addEventListener("touchstart", function () {
            let msg = document.getElementById("msgArea").value;
            let userList = document.getElementById("userList").value;
            console.log("TESTTTTTT");
            console.log(userList);
            
            if(msg != ""){
            
                document.getElementById("error2").innerHTML = "";
                
                let camOptions = {
                    destinationType: Camera.DestinationType.FILE_URI,
                    encodingType: Camera.EncodingType.PNG,
                    mediaType: Camera.MediaType.PICTURE,
                    pictureSourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: true,
                    targetWidth: 300,
                    targetHeight: 300
                };
                navigator.camera.getPicture(app.picSuccess, app.picFail, camOptions);
            }
            else{
                document.getElementById("error2").innerHTML = "Please write a message first.";
            }
        })
    },

    login: function () {
        let usernameVal = document.getElementById("username").value;
        let emailVal = document.getElementById("email").value;
        
        if(usernameVal == "" || emailVal == ""){
            
            console.log("all fields required.");
            
            document.getElementById("error").innerHTML = "All fields required.";
        }
        else{
            
            app.deleteHandler();
            
            document.getElementById("listOfMessages").innerHTML = "";
            document.getElementById("error").innerHTML = "";
        
            let formData = new FormData();
            formData.append("user_name", usernameVal);
            formData.append("email", emailVal);
            let options = {
                method: 'post',
                mode: 'cors',
                body: formData
            };
            let reg = new Request("https://griffis.edumedia.ca/mad9022/steg/login.php");
            console.log(formData);
            console.log(options);

            fetch(reg, options)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    if (data.code != 0) {
                        //alert("Login/Registration failed:\n" + data.message);
                        
                        document.getElementById("error").innerHTML = data.message;
                    } else {
                        app.currentId = data.user_id;
                        app.currentGuid = data.user_guid;
                        console.log(app.currentId);
                        console.log(app.currentGuid);
                        
                        document.getElementById("error").innerHTML = "";
                        
                        document.activeElement.blur();
                        
                        app.toggleMsgModal();
                    }
                })
                .catch(function (err) {
                    alert(err.message);
                });

            

        }
    },

    register: function () {
        
        let usernameVal = document.getElementById("username").value;
        let emailVal = document.getElementById("email").value;
        
        if(usernameVal == "" || emailVal == ""){
            
            console.log("all fields required.");
            
            document.getElementById("error").innerHTML = "All fields required.";
        }
        else{
            
            app.deleteHandler();
            
            document.getElementById("error").innerHTML = "";
        
            let formData = new FormData();
            formData.append("user_name", usernameVal);
            formData.append("email", emailVal);
            let options = {
                method: 'post',
                mode: 'cors',
                body: formData
            };
            let reg = new Request("https://griffis.edumedia.ca/mad9022/steg/register.php");
            console.log(formData);
            console.log(options);

            fetch(reg, options)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    if (data.code != 0) {
                        //alert("Login/Registration failed:\n" + data.message);
                        
                        document.getElementById("error").innerHTML = data.message;
                        
                    } else {
                        app.currentId = data.user_id;
                        app.currentGuid = data.user_guid;
                        console.log(app.currentId);
                        console.log(app.currentGuid);
                        document.getElementById("error").innerHTML = "";
                        
                        document.activeElement.blur();
                        
                        app.toggleMsgModal();
                    }
                })
                .catch(function (err) {
                    alert(err.message);
                });

            
        }
    },
    
    deleteHandler: function (){
        
        document.getElementById("btnDelete").addEventListener("touchstart", function(){
            app.deleteMessage();
        });
    },
    
    deleteMessage: function (){
        
        document.getElementById("listOfMessages").innerHTML = "";
        //app.msgList();
        
        let formData = new FormData();
            formData.append("user_id", app.currentId);
            formData.append("user_guid", app.currentGuid);
            formData.append("message_id", app.currentMsgId);
            let options = {
                method: 'post',
                mode: 'cors',
                body: formData
            };
            let reg = new Request("https://griffis.edumedia.ca/mad9022/steg/msg-delete.php");
            console.log(formData);
            console.log(options);

            fetch(reg, options)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    if (data.code != 0) {
                        //alert("Login/Registration failed:\n" + data.message);
                        
                        document.getElementById("error").innerHTML = data.message;
                        
                    } else {
                        
                        console.log("SUCCESS DELETE");    
                        
                        document.getElementById("listOfMessages").innerHTML = "";
                        
                        app.msgList();
                        
                        document.getElementById("msgDetails").classList.remove("active");
//                        app.currentId = data.user_id;
//                        app.currentGuid = data.user_guid;
//                        console.log(app.currentId);
//                        console.log(app.currentGuid);
//                        document.getElementById("error").innerHTML = "";
//                        app.toggleMsgModal();
                    }
                })
                .catch(function (err) {
                    alert(err.message);
                });
        
        /*
        {"name":"deleteMessage",
        "endpoint":"msg-delete.php",
        "desc":"delete a message and it's image from the queue on the server. User must be logged in.",
        "requires":["user_id","user_guid","message_id"]}]}
        */
    },

    msgList: function () {
        
        console.log("showing list...");
        
        
        //-TRYING--------------------
        
        /*
        {
        "name":"listMessages",
        
        "endpoint":"msg-list.php",
        
        "desc":"get the list of messages for a user from the queue. User must be logged in",
        
        "requires":["user_id","user_guid"]},
        */
        
        let formData = new FormData();
        formData.append("user_id", app.currentId);
        formData.append("user_guid", app.currentGuid);
        let options = {
            method: 'post',
            mode: 'cors',
            body: formData
        };
        let reg = new Request("https://griffis.edumedia.ca/mad9022/steg/msg-list.php");
        fetch(reg, options)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                
                //BUILD THE LIST----
            
                console.log(data);
            
            
                for(var i = 0; i < data.messages.length; i++){
                    let name = data.messages[i].user_name;
                    let msgId = data.messages[i].msg_id;
                    //console.log(name);
                
                    //let name = element.user_name;
                    
                    //console.log(index);
                    
                    //console.log(id);
                    //console.log(name);
                    
                    let listOfMessages = document.getElementById("listOfMessages");
                    
                    let li = document.createElement("li");
                    li.classList.add("table-view-cell");
                    li.classList.add("media");
                    
                    let a = document.createElement("a");
                    a.classList.add("navigate-right");
                    a.classList.add("listItem");
                    a.setAttribute("id", msgId);
                    
                    //TRYINGGGGGGGG
                    a.addEventListener("touchstart", app.viewDetails);
                    
                    //a.href = "#msgDetails";
                    
                    let span = document.createElement("span");
                    span.classList.add("media-object");
                    span.classList.add("pull-left");
                    span.classList.add("icon");
                    span.classList.add("icon-pages");
                    
                    let div = document.createElement("div");
                    div.classList.add("media-body");
                    
                    let msg = "Message from: " + name;
                    console.log(msg);
                    let msgTxt = document.createTextNode(msg);
                    
                    div.appendChild(msgTxt);
                    
                    a.appendChild(span);
                    a.appendChild(div);
                    
                    li.appendChild(a);
                    
                    listOfMessages.appendChild(li);
                    
                    
                    
                    
                    /*
                    
                    
                    let list = document.querySelectorAll(".listItem");
        
                    for(var i = 0; i < list.length; i++){
                        list[i].addEventListener("touchstart", function(ev){

                            let msgId = this.id;
                            console.log("clicked on msgId: " + msgId);

                        });
                    }
                    
                    
                    <li class="table-view-cell media">
                        <a class="navigate-right" href="#msgDetails">
                            <span class="media-object pull-left icon icon-pages"></span>
                            <div class="media-body"> Message from: Simon Pegg </div>
                        </a>
                    </li>
                    */
                    

                }
            
                //------------------
            })
            .catch(function (err) {
                alert(err.message);
            });
        
        
        
        //---------------------------
    },
    
    viewDetails: function(ev) {
        
        let thisClick = ev.currentTarget;
        
        let msgId = thisClick.id;
        
        app.currentMsgId = msgId;
        
        console.log(msgId);
        
        document.getElementById("msgDetails").classList.add("active");
        
        let detailsDiv = document.getElementById("msgDetailsDiv");
        
        detailsDiv.innerHTML = "";
        
        let h3 = document.createElement("h3");
        
        let txtNode = document.createTextNode(msgId);
        
        
        
        //TRYINGGGGGGGGGGGGGGGGGGGGGGGG--------------------------------
            
            let formData = new FormData();
            formData.append("user_id", app.currentId);
            formData.append("user_guid", app.currentGuid);
            formData.append("message_id", msgId);
            
            let options = {
                method: 'post',
                mode: 'cors',
                body: formData
            };
            
            /*
            {"name":"getMessage",
            "endpoint":"msg-get.php",
            "desc":"get the single image for the message. User must be logged in.",
            "requires":["user_id","user_guid","message_id"]}
            */
        
            let send = new Request("https://griffis.edumedia.ca/mad9022/steg/msg-get.php");
            //console.log(formData);
            //console.log(options);

            fetch(send, options)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    if (data.code != 0) {
                        alert("Get-msg failed:\n" + data.message);
                    } else {
                        console.log(data);
                        console.log("SUCCESSFUL GET IMG");
                        
                        //----------------///////////////////////////////
                        
                        let msgDetailsDiv = document.getElementById("msgDetailsDiv");
                        msgDetailsDiv.innerHTML = "";
                        let canvas = document.createElement("canvas");
                        canvas.setAttribute("id", "picCanvas");
                        let ctx = canvas.getContext('2d');
                        let sentImg = document.createElement("img");
                        sentImg.crossOrigin = "anonymous";
                        //sentImg.src = "data:image/jpeg;base64," + imageURI;
                        sentImg.src = "https://griffis.edumedia.ca/mad9022/steg/" + data.image;
                        sentImg.addEventListener('load', function (ev) {

                            //var w = sentImg.width;
                            //var h = sentImg.height;
                            
                            canvas.width = 300;
                            canvas.height = 300;
                            ctx.drawImage(sentImg, 0, 0);
                            
                            console.log(app.currentId);
                            
                            msgDetailsDiv.appendChild(canvas);
                            
                            let userId = BITS.getUserId(canvas);
                            
                            console.log("GETUSERIDFROMCANVAS:");
                            console.log(userId);
                            
                            console.log("CURRENT ID:");
                            console.log(app.currentId);
                            
                            let txtMsg = BITS.getMessage(app.currentId, canvas);
                            //let txtMsg = BITS.getMessage(app.currentId, canvas);
                            
                            console.log(txtMsg);
                            
                            let msgDiv = document.getElementById("msgTxtDiv");
                            
                            msgDiv.innerHTML = "";
                            
                            let msgP = document.createElement("p");
                            
                            msgP.innerHTML = txtMsg;
                            
                            msgDiv.appendChild(msgP);
                            
                            
                            //TRYING TO EMBED---------------
                            //epp.embedMessage();
                            //------------------------------
                        });
                        //picBtn.style.display = "none";
                        //sendPicBtn.style.display = "block";

                        
                        
                        //----------------------//////////////////////////
                        
                        
                        //let sentImg = document.createElement("img");
                        
                        //sentImg.src = "https://griffis.edumedia.ca/mad9022/steg/" + data.image;
                        
                        //detailsDiv.appendChild(sentImg);
                        //document.getElementById("msgSend").classList.remove("active");
                        //app.toggleSendModal();
                        
                        //app.currentId = data.user_id;
                        //app.currentGuid = data.user_guid;
                        //console.log(app.currentId);
                        //console.log(app.currentGuid);
                    }
                })
                .catch(function (err) {
                    alert(err.message);
                });
    
        //------------------------------------------------------------------
    
        //img.src = "https://griffis.edumedia.ca/mad9022/steg/";
        
        h3.appendChild(txtNode);
        detailsDiv.appendChild(h3);
        
        
    },
    
    embedMessage: function(ev) {
        
        let uId = document.getElementById("userList").value;
        //let uBits = BITS.numberToBitArray(61);
        console.log(uId);
        
        let uBits = BITS.numberToBitArray(uId);
        
        let msg = document.getElementById("msgArea").value;
        let msgBits = BITS.stringToBitArray(msg);
        
        let canv = document.getElementById("picCanvas");
        
        let msgLength = msg.length;
        
        let bitLength = BITS.numberToBitArray(msgLength*16);
        
        //console.log("msg: " + msg);
        //console.log("msgBits: " + msgBits);
        //console.log("msgLength: " + msgLength);
        //console.log("bitLength: " + bitLength);
        
        BITS.setUserId(uBits, canv);
        console.log(uBits);
        
        BITS.setMsgLength(bitLength, canv);
        BITS.setMessage(msgBits, canv);
    },
    
    decodeMessage: function(ev) {
        
        //BITS.getMessage();
    },

    toggleMsgModal: function () {
        
        app.msgList();
        
        let msgModal = document.getElementById("msgList");
        msgModal.classList.toggle("active");
    },

    toggleSendModal: function () {
        app.sendModal();
        let sendModal = document.getElementById("msgSend");
        sendModal.classList.toggle("active");
    },

    picSuccess: function (imageURI) {
        console.log("success!");
        app.imageSend = imageURI;
        let picBtn = document.getElementById("picBtn");
        let sendBtn = document.getElementById("sendPicBtn");
        let imageBox = document.getElementById("imageBox");
        imageBox.innerHTML = "";
        let canvas = document.createElement("canvas");
        canvas.setAttribute("id", "picCanvas");
        let ctx = canvas.getContext('2d');
        let img = document.createElement("img");
        img.crossOrigin = "anonymous";
        img.src = imageURI;
        img.addEventListener('load', function (ev) {
            
            //var w = img.width;
            //var h = img.height;
            
            canvas.width = 300;
            canvas.height = 300;
            ctx.drawImage(img, 0, 0);

        });
        picBtn.style.display = "none";
        sendPicBtn.style.display = "block";
        
        imageBox.appendChild(canvas);
        
        
        
        //----------------------------------------------------
        sendPicBtn.addEventListener("touchstart", function(){
            
            app.sendMsg(canvas);
        });
        //----------------------------------------------------
    },
    
    sendMsg: function(canvas){
        
        app.embedMessage();
        
        let myDataURL = canvas.toDataURL();
        
        app.dataURLToBlob(myDataURL)
        
        .then(function(blob){
            
            // WRONG PLACE------
            let userToSend = document.getElementById("userList").value;
            
            let msgToSend = document.getElementById("msgArea").value;
            //------------------
            
            console.log("User: " + userToSend);
            console.log("Msg: " + msgToSend);
            
            let recId = 62;
            
            console.log(app.currentId);
            console.log(app.currentGuid);
            console.log(recId);
            console.log(blob);
            
            let formData = new FormData();
            formData.append("user_id", app.currentId);
            formData.append("user_guid", app.currentGuid);
            formData.append("recipient_id", userToSend);
            formData.append("image", blob);
            
            let options = {
                method: 'post',
                mode: 'cors',
                body: formData
            };
            
            let send = new Request("https://griffis.edumedia.ca/mad9022/steg/msg-send.php");
            //console.log(formData);
            //console.log(options);

            fetch(send, options)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    if (data.code != 0) {
                        alert("Send-msg failed:\n" + data.message);
                    } else {
                        
                        console.log("SUCCESS");
                        document.activeElement.blur();
                        //document.getElementById("msgSend").classList.remove("active");
                        
                        document.getElementById("msgArea").value = "";
                        document.getElementById("imageBox").innerHTML = "";
                        picBtn.style.display = "block";
                        app.toggleSendModal();
                        
                        //app.currentId = data.user_id;
                        //app.currentGuid = data.user_guid;
                        //console.log(app.currentId);
                        //console.log(app.currentGuid);
                    }
                })
                .catch(function (err) {
                    alert(err.message);
                });
        });
        
 
    },
    
    picFail: function(err) {
      alert("Camera failed: " + err.message);  
    },

    sendModal: function () {
        
        let formData = new FormData();
        formData.append("user_id", app.currentId);
        formData.append("user_guid", app.currentGuid);
        let options = {
            method: 'post',
            mode: 'cors',
            body: formData
        };
        let reg = new Request("https://griffis.edumedia.ca/mad9022/steg/user-list.php");
        fetch(reg, options)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                app.buildUserList(data);
                
            })
            .catch(function (err) {
                alert(err.message);
            });
    },
    
    buildUserList: function(data) {
        let userList = document.getElementById("userList");
        userList.innerHTML = "";
        data.users.forEach(function (element, index){
            let id = element.user_id;
            let name = element.user_name;
            console.log(id);
            console.log(name);
            let option = document.createElement("option");
            option.value = id;
            option.text = name;
            userList.add(option);
            
        });
        
    },

    toggleDetailsModal: function () {
        let detailsModal = document.getElementById("msgDetails");
        detailsModal.classList.toggle("active");
    },
    
    dataURLToBlob: function(dataURL) {
        return Promise.resolve().then(function () {
            var type = dataURL.match(/data:([^;]+)/)[1];
            var base64 = dataURL.replace(/^[^,]+,/, '');          
            var buff = app.binaryStringToArrayBuffer(atob(base64));
               return new Blob([buff], {type: type});
            });
    },
    
    binaryStringToArrayBuffer: function(binary) {
        var length = binary.length;
        var buf = new ArrayBuffer(length);
        var arr = new Uint8Array(buf);
        var i = -1;
        while (++i < length) {
            arr[i] = binary.charCodeAt(i);
        }
        return buf;
    },
};

app.initialize();
