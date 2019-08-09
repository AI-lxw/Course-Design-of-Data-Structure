layui.use('layer', function(){
var layer = layui.layer;
var start_btn = document.getElementById("start");
var data_list = document.getElementById("data_list");
var sort_list = document.getElementById("sort_list");
var wrap = document.getElementById('wrap');
var socket = io('http://localhost:3000/');
    socket.on('connect', function(){
        console.log('连接成功');
    });
    socket.on('msg', function(data){
        var hostnames = document.querySelectorAll("#data_list div.hostname"),
            ahuf_completed = document.querySelectorAll('#data_list span.huf_completed'),
            ahuf_total = document.querySelectorAll('#data_list span.huf_total');
        var atrsl_completed = document.querySelectorAll("#data_list span.completed"),
            atrsl_total = document.querySelectorAll("#data_list span.total");
        var sort_row = document.querySelectorAll('#sort_list > tr'),
            iscompleted = document.querySelectorAll("#data_list div.iscompleted"),
            a_iscompleted = document.querySelectorAll("#data_list div.a_iscompleted"),
            d_completed = document.querySelectorAll('#data_list span.d_completed'),
            d_total = document.querySelectorAll('#data_list span.d_total');
        
        switch (data.Flag) {
            case 'HOST':
                var HostIP = `<tr><td><div>${data.HostIP}</div></td>`,//ip
                    HostName = `<td><div class = 'hostname'>${data.HostName}</div></td>`,
                    HostSeq = `<td><div>${data.HostSeq}</div></td>`,//标志
                    // Flag = `<td><div>${null}</div></td>`,//
                    huf_com_prog = `<td><div><span class = 'huf_completed'>0</span>/<span class='huf_total'>${data.Total}</span></div></td>`,
                    pic_trsl_prog = `<td><div class = 'iscompleted'>未完成</div></td>`,
                    accept = `<td><div class = 'a_iscompleted'>未完成</div></td>`
                    huf_de_prog = `<td><div><span class = 'd_completed'>0</span>/<span class='d_total'>0</span></div></td>`;
                    
                var str = HostIP + HostName + HostSeq  +huf_com_prog +pic_trsl_prog + accept + huf_de_prog ;
                data_list.innerHTML += str;
                var row = document.querySelectorAll("#data_list  tr");
                console.log(hostnames);
            
                for (let i = 0; i < row.length; i++) {
                    var name = hostnames[i].innerHTML;
                    row[i].onclick = function(){
                        layer.open({
                            content: '即将进行哈夫曼压缩',
                            yes: function(index, layero){
                                socket.emit('send',{hostName:name,code:1})
                                layer.close(index); //如果设定了yes回调，需进行手工关闭
                            }
                        });  
                    }
                    
                }
                break;
            case 'HUFF':
                var row = document.querySelectorAll("#data_list  tr");
                    console.log(hostnames);
                for (let i = 0; i < row.length; i++) {
                    row[i].a = i;
                    console.log(row[i].a);
                    row[i].onclick = function(){
                        var a = this.a;
                        console.log(a);
                        layer.open({
                            content: '即将进行哈夫曼压缩',
                            yes: function(index, layero){
                                var name = hostnames[a].innerHTML;
                                console.log(name);
                                socket.emit('send',{hostName:name,code:1})
                                layer.close(index); //如果设定了yes回调，需进行手工关闭
                            }
                        });  
                    }
                }
                //渲染哈夫曼压缩进度
                for (let i = 0; i < hostnames.length; i++) {
                    
                    if (data.HostName == hostnames[i].innerHTML) {
                        ahuf_completed[i].innerHTML=data.Completed;
                        ahuf_total[i].innerHTML = data.Total;
                    }
                    
                }
                break;
            case 'PSNT':
                for (let i = 0; i < hostnames.length; i++) {
                    if (hostnames[i].innerHTML == data.HostName) {
                        iscompleted[i].innerHTML = '已完成' 
                    }
                    
                }
                break;
            case 'SORT':
                    // socket.emit('send','1111')
                break;
                
            case 'SSNT':
                // socket.emit('send','1111')
                break;
                
            case 'SFIN':
            // socket.emit('send','1111')
                break;
            case 'DSTB':
                for (let i = 0; i < hostnames.length; i++) {
                    if (hostnames[i].innerHTML == data.HostName) {
                        a_iscompleted[i].innerHTML = '已完成' 
                    }
                }
                break;
            case 'RSLT':
                wrap.classList.remove('hide');
                wrap.classList.add('display');
                var Seq = `<tr><td><div class = 'seq'>${data.Seq}</div></td>`,
                    SrcHostName = `<td><div>${data.SrcHostName}</div></td>`,//ip
                    DstHostName = `<td><div>${data.DstHostName}</div></td>`,
                    PictureName = `<td><div>${data.PictureName}</div></td>`,//标志
                    // Flag = `<td><div>${null}</div></td>`,//
                    Size = `<td><div>${data.Size}</div></td>`;
                    
                    var str = Seq + PictureName + SrcHostName  + Size + DstHostName  ;
                    sort_list.innerHTML += str;
                    break;
            case 'DEHF':
                for (let i = 0; i < hostnames.length; i++) {
                    
                    if (data.HostName == hostnames[i].innerHTML) {
                        d_completed[i].innerHTML = data.Completed;
                        d_total[i].innerHTML = data.Total;
                    }
                    
                }
                break;
            default:
                break;
        }
        
    });   
    socket.on('disconnect', function(){
        console.log('连接关闭');
    });
});  
