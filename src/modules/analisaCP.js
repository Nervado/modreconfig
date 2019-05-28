//trata arquivo do levantamento
exports.getDadosUteisDoLevantamento = function(conteudo_arquivo,tipos){
    //variavéis a serem adicionadas a cada nó (relé) da rede
    let tags = []
    let relaysFounds = []
    let modbusAdress = []
    let titulo = conteudo_arquivo[0] //le titulo do arquivo
    let indices_comandos = []
    let comandos = []
    let tmp
    let parametros = {}
    
    for(let i = 0; i< conteudo_arquivo.length;i++){
        tipos.forEach(function(e){
            //console.log(e)
            if(conteudo_arquivo[i].includes(e)){
                //toDo...
                tmp = conteudo_arquivo[i].replace(/\s/g,' ').split(' - ')
                //console.log(tmp)
                tags.push(tmp[0].trim())
                modbusAdress.push(parseInt(tmp[1].trim()))
                relaysFounds.push(e)
                indices_comandos.push(i+2)//indice de onde está a primeira linha de sinais do arquivos                              
                
            }
        })
    }
        let finaldoscomandos = []
    for(let i=0;i<indices_comandos.length-1;i++){
        finaldoscomandos.push(indices_comandos[i+1]-2)
    }
    finaldoscomandos.push(conteudo_arquivo.length)
    //console.log(indices_comandos)    
    //console.log(finaldoscomandos)
    let matrix_comandos = []
    let matrix_comentarios = []
    let matrix_registradores = []
    let matrix_numeroDaFC = []
    for(let i in finaldoscomandos){
        let comando = new Array
        let comentario = new Array
        let registrador = new Array
        let numeroDaFC  = new Array
        for(let j = indices_comandos[i];j<finaldoscomandos[i];j++){
            comando.push(conteudo_arquivo[j].split(' - ')[0].split(' ')[0])
            comentario.push(conteudo_arquivo[j].split('|')[0].replace(conteudo_arquivo[j].split(' - ')[0].split(' ')[0],''))
            registrador.push(conteudo_arquivo[j].split('|')[1])
            numeroDaFC.push(0)
            //console.log(conteudo_arquivo[j].split('|')[1])
        }
        matrix_comandos.push(comando)
        matrix_comentarios.push(comentario)
        matrix_registradores.push(registrador)
        matrix_numeroDaFC.push(numeroDaFC)
    }
    
    parametros = {tags,modbusAdress,relaysFounds,matrix_comandos, matrix_comentarios, matrix_registradores, matrix_numeroDaFC}
    //console.log(parametros.relaysFounds,parametros.tags,parametros.matrix_comandos)

    
    return parametros
}
