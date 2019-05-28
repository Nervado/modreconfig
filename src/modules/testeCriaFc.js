//imports 
const path = require('path')
const redes = require('./criaRede')
const cp = require('./analisaCP')
const dbL = require('./criaDBLeituras')
const dbW = require('./criaDBEscritas')
const fcMake = require('./criaFC')
const fs =  require('fs')

//copiado para remota analisa rearranjo.js
let remota = remotas.getRemota('RemotaPn99') 
let diretorio = remota.nome.split('N')[1]

//cria redes para cada cp
let vetorRedes = []
let k = 0
remota.numCPs.forEach(function(numCP){    
    //console.log(k)
    let arquivoCP = `C-${numCP}.txt`
    //let path =  __dirname + arquivoCP
    let _path = path.resolve('src/assets/lists', arquivoCP)
    let data = fs.readFileSync(_path,'utf-8')
    data = data.trim()
    data = data.split(/\r?\n/)   
    console.log('Encontrado: '+ arquivoCP)
    data = data.map(function(linha){return linha.trim()})
    let parametros = cp.getDadosUteisDoLevantamento(data, remota.tipos)
    //console.log(parametros.matrix_registradores)
    vetorRedes.push(redes.criaRede(parametros,remota.tipos,remota.dataSymblDbs[k]))
    k++
})

k = 0
remota.numFCs.forEach(numFC => {
    let fc 
    let arquivoFC = `${remota.nome.split('a')[1]}FC${numFC}.txt`
    //let path = __dirname + arquivoFC
    let _path = path.resolve('src/assets/oldfcs',arquivoFC)
    let data = fs.readFileSync(_path,'utf-8')
    //console.log(arquivoFC)
    fc = fcMake.setFC(vetorRedes,data.split(/\r?\n/),numFC)
    //_path = __dirname + `\\${remota.nome.split('a')[1]}FC${numFC}new.scl`
    _path = path.resolve(`public/out/pn${remota.nome.split('N')[1]}/`,`${remota.nome.split('a')[1]}FC${numFC}new.scl`) 
    //path.resolve(`public/out/pn0${1}/`, 'C-1.txt'))
    if(fc === ''){}
    else{
        //salvar arquivo no diretorio local
        fs.writeFile(_path, fc,function(erro){
            if(erro){ throw erro}
            console.log(`Arquivo salvo em: `,_path)
            //console.log(fc)
        })

        //salvar arquivo no diretorio de saida
        //path = `C:\\Users\\Evandro\\Desktop\\Projeto Remoção C264 P53\\Logica Nova\\PN${diretorio}`
        //let fileName = `\\${remota.nome.split('a')[1]}FC${numFC}new.scl`
        //path = path + fileName
        //fs.writeFile(path, fc,function(erro){
        //    if(erro){ throw erro}
        //    console.log(`Arquivo salvo em: `,path)
        //    //console.log(fc)
        //})

    }
})
 
k = 0
if(remota.numDBsLeituras.length === vetorRedes.length){//verificar se o numero de CPs analisadas é igual a quanitade de datablocks definidos
    remota.numDBsLeituras.forEach(num => { //para cada rede definida cria a DB de requisições de leitura
        let arquivoDB = `DB${num}.scl`
        let _path = path.resolve(`public/out/pn${remota.nome.split('N')[1]}/`, arquivoDB) 
        //let path = __dirname + arquivoDB
        let db = dbL.escreveDBLeituras(vetorRedes[k],num)
        let sclFonteDB = dbL.setDBLeituras(db,num,1)         
        k++
        // salvar arquivo no diretorio local 
        fs.writeFile(_path,sclFonteDB,function(erro){
            if(erro){ throw erro}
            console.log(`Arquivo salvo em: `,_path)
            //console.log(sclFonteDB)
        })

        //Salvar arquivo no diretorio de saida         
        //arquivoDB = `\\\\DB${num}.scl`
        //path = `C:\\Users\\Evandro\\Desktop\\Projeto Remoção C264 P53\\Logica Nova\\PN${diretorio}`
        //path = path + arquivoDB
        //fs.writeFile(path,sclFonteDB,function(erro){
        //    if(erro){ throw erro}
        //    console.log(`Arquivo salvo em: `,path)
        //    //console.log(dbDTRCV)
        //})


    })
}

//Escrever DB de Comandos de escrita
k = 0
if(remota.numDBsEscritas.length === vetorRedes.length){//verificar se o numero de CPs analisadas é igual a quanitade de datablocks definidos
    remota.numDBsEscritas.forEach(num => { //para cada rede definida cria a DB de requisições de escrita
        let arquivoDB = `DB${num}.scl`
        let _path = path.resolve(`public/out/pn${remota.nome.split('N')[1]}/`, arquivoDB) 
        //let path = __dirname + arquivoDB
        let db = dbW.setDBEscritas(vetorRedes[k],num)
        k++
        // salvar arquivo no diretorio local 
        fs.writeFile(_path,db,function(erro){
            if(erro){ throw erro}
            console.log(`Arquivo salvo em: `,_path)
            //console.log(sclFonteDB)
        })

        //Salvar arquivo no diretorio de saida         
        //arquivoDB = `\\\\DB${num}.awl`
        //path = `C:\\Users\\Evandro\\Desktop\\Projeto Remoção C264 P53\\Logica Nova\\PN${diretorio}`
        //path = path + arquivoDB
        //fs.writeFile(path,db,function(erro){
        //    if(erro){ throw erro}
        //    console.log(`Arquivo salvo em: `,path)
        //    //console.log(dbDTRCV)
        //})
    })
}
//Fim da criacao de DBS de comandos de escrita

k = 0
i = 1
vetorRedes.forEach(rede =>{
    let totalizaData = 0
    let totalizaTempo = 0
    //console.log('\nRede: \n')
    rede.forEach(rele =>{
       // console.log(rele.sizeReq)
       // console.log(rele.iniRange)
       // console.log(rele.finRange)
       // console.log(rele.tempoLeitura)
        totalizaTempo += rele.tempoLeitura
        //console.log(rele.tag,rele.numeroDaFC)
        //console.log(rele.tag,rele.tipo,rele.registradores,rele.iniRange,rele.finRange)//,rele.sizeReq,rele.getNumberOfReg())
        totalizaData += rele.getNumberOfReg()
        //console.log(totalizaData)
        
    })
    let numDBRCVDT = remota.dataRecDbsNs[k]
    k++
    let dbDTRCV = `
DATA_BLOCK DB${numDBRCVDT}
    STRUCT
        LEITURA: ARRAY[0 .. ${totalizaData}] OF WORD;
    END_STRUCT
BEGIN
END_DATA_BLOCK
`
    //salvar arquivo DB com os dados recebidos ...fonte em .SCL
    let arquivoDBRCVDT = `DB${numDBRCVDT}.scl`
    let _path = path.resolve(`public/out/pn${remota.nome.split('N')[1]}/`, arquivoDBRCVDT)
    //let path = __dirname + arquivoDBRCVDT 
    
    //Salva no diretorio atual
    fs.writeFile(_path,dbDTRCV,function(erro){
        if(erro){ throw erro}
        console.log(`Arquivo salvo em: `,_path)
        //console.log(dbDTRCV)
    })
    //Salva uma copia do diretorio de saida 
    //arquivoDBRCVDT = `\\DB${numDBRCVDT}.scl`
    //path = `C:\\Users\\Evandro\\Desktop\\Projeto Remoção C264 P53\\Logica Nova\\PN${diretorio}`
    //path = path + arquivoDBRCVDT
    //fs.writeFile(path,dbDTRCV,function(erro){
    //    if(erro){ throw erro}
    //    console.log(`Arquivo salvo em: `,path)
    //    //console.log(dbDTRCV)
    //})


    console.log('Scan total time '+`Network ${i++}`,totalizaTempo.toFixed(2), 'ms')
   //console.log('Quantidade de dados: ' + totalizaData*2 + ' Bytes') //esse valor corresponde ao tamanho em bytes da DB de saida dos dados
})


vetorRedes.forEach(rede => {
    rede.forEach(rele => {
        console.log('Tag: ',rele.tag,',',
        'Qtd.  Registradores: ',
        rele.getNumberOfReg(),
        'Range Inicial: ',rele.iniRange,
        'Tmnho da Reqsc.: ',rele.sizeReq,
        'Tempo de Scan,: ',rele.tempoLeitura.toFixed(2),
        ' ms')

    })
})
//**/


//Exibe dados das Redes

//console.log('\n\nDados de Rede\n')
//vetorRedes[0].forEach(rele=>{
    //console.log(rele.endereco, rele.tag, rele.iniRange, rele.sizeReq)
    //console.log(rele.q.length,rele.tag, rele.comandos)
//})
//console.log('\n\n')

//console.log(vetorRedes[1][1].iniRange,vetorRedes[1][1].finRange, vetorRedes[1][1].sizeReq,vetorRedes[1][1].nReq)

//console.log(vetorRedes[0])