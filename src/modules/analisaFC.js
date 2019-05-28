//Analisa FC de rearranjo
//trata arquivo da FC de rearranjo antiga

exports.getDadosUteisFCold = function(rede,conteudo_arquivo,numFC){
    //let dataSymblDbs
    for(let i in rede){
               
        for(let j in rede[i].comandos){            
            //console.log(rede[i].dataSymblDbs)
            for(let k=0; k < conteudo_arquivo.length; k ++){
                if(conteudo_arquivo[k].includes(rede[i].comandos[j]) && conteudo_arquivo[k].includes(rede[i].dataSymblDbs) ){
                   // console.log(rede[i].dataSymblDbs,conteudo_arquivo[k])      
                    //tratar tensoes 
                    if(conteudo_arquivo[k].includes('ET')){                        
                        let test = parseInt(conteudo_arquivo[k+1].replace(/\s/g,"").split(';')[0].split('QW')[1])
                        let rep = false
                        //console.log(conteudo_arquivo[k])
                        rede[i].qwv.forEach(element => {
                          if(element == test){rep = true}  
                        })
                        
                        if(rep === false){
                        //console.log('Atrib.:',conteudo_arquivo[k])  
                        //console.log('j',j)                      
                        rede[i].qwv.push(conteudo_arquivo[k+1].replace(/\s/g,"").split(';')[0].split('QW')[1])//
                        rede[i].qav.push(conteudo_arquivo[k])//   
                        rede[i].qcv.push(conteudo_arquivo[k+1].split('//')[1])//
                        rede[i].qiv.push(j)
                        rede[i].numeroDaFC[j]= numFC//numero da fc em que o comando/sinal foi encontrado             
                        //console.log(rede[i].qwv)      
                    
                    }
                    }                    
                    //tratar potencias/fator de potencia
                    if(conteudo_arquivo[k].includes('JT')){
                        
                        let test = parseInt(conteudo_arquivo[k+1].replace(/\s/g,"").split(';')[0].split('QW')[1])
                        let rep = false
                        //console.log(conteudo_arquivo[k])
                        rede[i].qwp.forEach(element => {
                          if(element == test){rep = true}  
                        })

                        if(rep === false){
                            //console.log('Atrib.:',conteudo_arquivo[k])  
                            //console.log(conteudo_arquivo[k])                      
                            rede[i].qwp.push(conteudo_arquivo[k+1].replace(/\s/g,"").split(';')[0].split('QW')[1])//
                            rede[i].qap.push(conteudo_arquivo[k])//   
                            rede[i].qcp.push(conteudo_arquivo[k+1].split('//')[1])//
                            rede[i].qip.push(j)   
                            rede[i].numeroDaFC[j]= numFC              
                        }
                    }
                    //tratar calculo de médias de correntes analogicas               
                    if( (k>0) && conteudo_arquivo[k-1].includes('IT') && conteudo_arquivo[k].includes('IT') && conteudo_arquivo[k+2].includes('IT')){
                        
                        let test = parseInt(conteudo_arquivo[k+6].split('QW')[1].split('//')[0].trim())
                        let rep = false
                        //console.log(conteudo_arquivo[k])
                        rede[i].qwi.forEach(element => {
                          if(element == test){rep = true}  
                        })

                        if(rep === false){
                            //console.log(conteudo_arquivo[k-1])
                            rede[i].qwi.push(parseInt(conteudo_arquivo[k+6].split('QW')[1].split('//')[0].trim()))
                            rede[i].qai.push(conteudo_arquivo[k-1])
                            rede[i].qai.push(conteudo_arquivo[k])
                            rede[i].qai.push(conteudo_arquivo[k+2])
                            rede[i].qci.push(conteudo_arquivo[k+6].split('//')[1])
                            rede[i].qii.push(parseInt(j)-1)
                            rede[i].qii.push(parseInt(j))
                            rede[i].qii.push(parseInt(j)+1)
                            rede[i].numeroDaFC[parseInt(j)-1] = numFC
                            rede[i].numeroDaFC[parseInt(j)] = numFC
                            rede[i].numeroDaFC[parseInt(j)+1] = numFC
                        }
                    }  

                    //atribuição de saídas booleanas
                    if(( k < conteudo_arquivo.length - 1) && conteudo_arquivo[k+1].includes('  Q  ') ){
                        
                        let test = conteudo_arquivo[k+1].replace(/\s/g,"").split(';')[0].split('=Q')[1].split('//')[0]
                        let rep = false
                        //console.log(test)
                        rede[i].q.forEach(element => {
                          if(element == test){rep = true}  
                        })
                        //test = false
                        if(rep === false){
                            //console.log(rede[i].q)
                            rede[i].q.push(conteudo_arquivo[k+1].replace(/\s/g,"").split(';')[0].split('=Q')[1].split('//')[0])//
                            //console.log(conteudo_arquivo[k+1].replace(/\s/g,"").split(';')[0].split('=Q')[1].split('//')[0])
                            rede[i].qa.push(conteudo_arquivo[k])//   
                            rede[i].qc.push(conteudo_arquivo[k+1].split('//')[1])//
                            rede[i].qi.push(j)//
                            rede[i].numeroDaFC[j]= numFC
                        }
                    }                 
                }          
            }
            //console.log('tamanho dos vetores com saidas de tensoes : ' + rede[i].qwv.length)
        }        
    }    
} 