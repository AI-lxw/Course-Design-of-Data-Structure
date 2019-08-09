var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();
const express = require("express"),
      app = express();
const router = require('./router/router.js');
const appserver = require('http').createServer(app);
const io = require('socket.io')(appserver);
var net = require('net');
var listenPort = 8080;


io.on('connection',function(socket){
    socket.emit('request', /* … */); // emit an event to the socket
    io.emit('broadcast', /* … */); // emit an event to all connected sockets      
    socket.on('send',(data)=>{
        global.mainHostInfo = data;
        event.emit('start_cmd');
    });
    var server = net.createServer(function(socket_java) {
        console.log('connect: ' +
            socket_java.remoteAddress + ':' + socket_java.remotePort);
        socket_java.setEncoding('binary');

        event.on('start_cmd', () => {
                socket_java.write('MAIN' + global.mainHostInfo.code.toString() + global.mainHostInfo.hostName);
                console.log('MAIN' + global.mainHostInfo.code.toString() + global.mainHostInfo.hostName);
        });

        socket_java.on('data',function(data) {
            //console.log("RAW: "+data);

            do {
                var segmentEnd = data.indexOf('$$');
                var segment = data.substring(0, segmentEnd);
                data = data.substring(segmentEnd+2);
                //console.log('*'+ segment);
                var flag = segment.slice(0,4);
                try {
                    switch(flag) {
                        case "HOST":
                            var separator1 = segment.indexOf('$');
                            var hostIP = "127.0.0.1";
                            var hostSeq = parseInt(segment.slice(4, separator1));
                            var hostName = segment.slice(separator1+1);
                            var hostObj = { 
                                "Flag":flag, 
                                "HostIP":hostIP, 
                                "HostSeq":hostSeq, 
                                "HostName":hostName
                            };

                            // ***********  Remove this manual start. **************
                            //if (hostSeq == 3) socket_java.write('MAIN1'+hostName);

                            //console.log(hostObj);
                            io.emit('msg',hostObj);
                            
                            if (hostSeq = 3) io.emit('msg',{Flag:"HEND"});
                            break;
                        case "HUFF":
                            var separator1 = segment.indexOf('$');
                            var separator2 = segment.indexOf('$', separator1+1);
                            var completed = parseInt(segment.slice(4, separator1));
                            var total = parseInt(segment.slice(separator1+1, separator2));
                            var hostName = segment.slice(separator2+1);
                            var huffObj = {
                                "Flag":flag, 
                                "Completed":completed, 
                                "Total":total, 
                                "HostName":hostName
                            };
                            //console.log(huffObj);
                            io.emit('msg',huffObj)       
                            break;
                        case "PSNT":
                            var hostName = segment.slice(4);
                            var psntObj = {
                                "Flag":flag, 
                                "HostName":hostName
                            };
                            //console.log(psntObj);
                            io.emit('msg',psntObj);
                            break;
                        case "SORT":
                            var hostName = segment.slice(4);
                            var sortObj = {
                                "Flag":flag, 
                                "HostName":hostName
                            };
                            //console.log(sortObj);
                            io.emit('msg',sortObj);                        
                            break;
                        case "SSNT":
                            var hostName = segment.slice(4);
                            var ssntObj = {
                                "Flag":flag, 
                                "HostName":hostName
                            };
                            //console.log(ssntObj);
                            io.emit('msg',ssntObj);
                            break;
                        case "SFIN":
                            var sfinObj = { "Flag":flag };
                            //console.log(sfinObj);
                            io.emit('msg',sfinObj);
                            break;
                        case "DSTB":
                            var hostName = segment.slice(4);
                            var dstbObj = {
                                "Flag":flag, 
                                "HostName":hostName 
                            };
                            //console.log(dstbObj);
                            io.emit('msg',dstbObj);
                            break;
                        case "RSLT":
                            var separator1 = segment.indexOf('$');
                            var separator2 = segment.indexOf('$', separator1+1);
                            var separator3 = segment.indexOf('$', separator2+1);
                            var separator4 = segment.indexOf('$', separator3+1);
                            var seq = segment.slice(4, separator1);
                            var size = segment.slice(separator1+1, separator2);
                            var picName = segment.slice(separator2+1, separator3);
                            var srcHostName = segment.slice(separator3+1, separator4);
                            var dstHostName = segment.slice(separator4+1);
                            var rsltObj = {
                                "Flag":flag,
                                "Seq":seq,
                                "Size":size,
                                "PictureName":picName,
                                "SrcHostName":srcHostName,
                                "DstHostName":dstHostName
                            };
                            //console.log(rsltObj);
                            io.emit('msg', rsltObj);                        
                            break;
                        case "DEHF":
                            var separator1 = segment.indexOf('$');
                            var separator2 = segment.indexOf('$', separator1+1);
                            var completed = parseInt(segment.slice(4, separator1));
                            var total = parseInt(segment.slice(separator1+1, separator2));
                            var hostName = segment.slice(separator2+1);
                            var dehfObj = {
                                "Flag":flag, 
                                "Completed":completed, 
                                "Total":total, 
                                "HostName":hostName
                            };
                            //console.log(dehfObj);
                            io.emit('msg',dehfObj);
                            break;
                        default:
                            console.log("ERROR: Invalid message: " + segment);
                    }
                } 
                catch (e) {
                    console.log("Resolve message failed.")
                }
            } while (data != '');

        });
        socket_java.write('Hello client!\r\n');
        //socket_java.pipe(socket_java);

        socket_java.on('error',function(exception) {
            console.log('socket_java error:' + exception);
            socket_java.end();
        });
        
        socket_java.on('close',function(data) {
            console.log('Client closed!');
            // socket_java.remoteAddress + ' ' + socket_java.remotePort);
        });
    }).listen(listenPort);

    server.on('listening',function() {
    console.log("Server listening:" + server.address().port);
    });

    server.on("error",function(exception) {
    console.log("Server error:" + exception);
    });
    
    // socket.on('reply', () => { /* … */ }); // listen to the event
})

// io.on('connection',function(socket){

//       setTimeout(function(){
//             for (let i = 0; i < arr.length; i++) {
//                   var element = arr[i];
//                   io.emit('msg',element)
//             }
//       },5000)
      
            
      
      
      
//       //监听客户端发来的消息
//       socket.on('send', (data) => {
//             console.log(data);
            
//        }); 
      
// })

//获取post参数
app.use(express.json());
app.use(express.urlencoded({extended:false}));
//配置静态资源目录
app.use(express.static(__dirname + '/static'))
//设置模板引擎
app.set('views',__dirname + '/view');
app.set('view engine','ejs');

// 访问根目录时加载routers模块
app.use('/',router);

appserver.listen(3000);