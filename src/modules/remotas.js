//Recebe como parametros todos os levantamentos de uma painel
//Informar numero de CPs
//Informar numero do painel 



let remotaPn01=
{
        noCPs: 4, 
        modulo : 'E011C',
        dataRecDbsNs: [303,304,306,307,309,310,312,313],//Parametro: RCVRD
        dataSymblDbs:['UNI_RECV_CP4','UNI_RECV_CP8','UNI_RECV_CP5','UNI_RECV_CP9','UNI_RECV_CP6','UNI_RECV_CP10','UNI_RECV_CP7','UNI_RECV_CP11'], //Nome do data block do RCVRD
        nomeCPs :['E011C4-CP-ELE025', 'E011C8-CP-ELE025','E011C5-CP-ELE025','E011C9-CP-ELE025','E011C6-CP-ELE025','E011C10-CP-ELE025','E011C7-CP-ELE025','E011C11-CP-ELE025'],
        iAdress: [[256,271], [272,287], [288,303], [304,319]],
        qAdress: [[256,271], [272,287], [288,303], [304,319]],
        tipos: ['p122','p127','p225','p241','p243','p632'],//familias de Relés que efetivamente existem (reles esperados)
        numDBsLeituras: [401,402,403,404],//405,406,407,408],//numero das dbs onde estão as requisiçÕes de leitura daquela remotaa
        numCPs: [1,2,3,4],//2,3,4],///,2,3,4],//número dos CPs que pertence a aquela remotaa na aba do levantamento....
        numFCs: [30,31],//,31],//,31,32],//numero das FCs que fazem o rearranjo para o clp de elétrica
        nome: 'remotaPN01'          
}  

let remotaPn02=
{
        noCPs: 5, 
        modulo : 'E021C',
        dataRecDbsNs: [303,304,306,307,309],//Parametro: RCVRD
        dataSymblDbs:['UNI_RECV_CP4','UNI_RECV_CP5','UNI_RECV_CP6','UNI_RECV_CP7','UNI_RECV_CP8'], //Nome do data block do RCVRD
        nomeCPs :['E011C4-CP-ELE025', 'E011C8-CP-ELE025'],
        iAdress: [[256,271], [272,287], [288,303], [304,319], [320,335]],
        qAdress: [[256,271], [272,287], [288,303], [304,319], [320,335]],
        tipos: ['p122','p127','p225','p241','p243','p632'],//familias de Relés que efetivamente existem (reles esperados)
        numDBsLeituras: [401,402,402,403,404],//405,406,407,408],//numero das dbs onde estão as requisiçÕes de leitura daquela remotaa
        numDBsEscritas:[21,22,23,24,25],
        numCPs: [9,10,11,12,13],//,//2,3,4],///,2,3,4],//número dos CPs que pertence a aquela remotaa na aba do levantamento....
        numFCs: [30,31],//,31],//,31,32],//numero das FCs que fazem o rearranjo para o clp de elétrica
        nome: 'remotaPN02'       
}  

let remotaPn03=
{
        noCPs: 4, 
        modulo : 'E031C',//nome da remota na logica
        dataRecDbsNs: [303,306,304,307],//numeros das dbs de dados recebidos
        dataSymblDbs:['UNI_RECV_CP4','UNI_RECV_CP6'],//nome dos blocos de dados recebidos na S.T 
        nomeCPs :['E031C4-CP-ELE027', 'E031C5-CP-ELE027','E011C6-CP-ELE025','E011C7-CP-ELE025'],//nome da CP no HardwareViwer
        iAdress: [[256,271], [272,287], [288,303], [304,319]],//mapeamento de entradas da remota para rede profibus
        qAdress: [[256,271], [272,287], [288,303], [304,319]],//mapeamento de saídas da remota para rede profibus
        tipos: ['p122','p127','p225','p241','p243','p632'],//familias de Relés que efetivamente existem (reles esperados)
        numDBsLeituras: [301,302,303,304],//numero das dbs onde estão as requisiçÕes de leitura daquela remotaa
        numCPs: [14,15],//número dos CPs que pertence a aquela remotaa
        numFCs: [30,31],//numero das FCs que fazem o rearranjo para o clp de elétrica
        nome: 'remotaPN03'  
}  

let remotaPn08=
{
        noCPs: 4, 
        modulo : 'E031C',
        dataRecDbsNs: [303,306,304,307],
        dataSymblDbs:['UNI_RECV_CP4','UNI_RECV_CP5','UNI_RECV_CP6','UNI_RECV_CP7'], 
        nomeCPs :['E031C4-CP-ELE027', 'E031C5-CP-ELE027','E011C6-CP-ELE025','E011C7-CP-ELE025'],
        iAdress: [[256,271], [272,287], [288,303], [304,319]],
        qAdress: [[256,271], [272,287], [288,303], [304,319]]        
}  

let remotaPn11=
{
        noCPs: 4, 
        modulo : 'E031C',
        dataRecDbsNs: [303,306,304,307],
        dataSymblDbs:['UNI_RECV_CP4','UNI_RECV_CP5','UNI_RECV_CP6','UNI_RECV_CP7'], 
        nomeCPs :['E031C4-CP-ELE027', 'E031C5-CP-ELE027','E011C6-CP-ELE025','E011C7-CP-ELE025'],
        iAdress: [[256,271], [272,287], [288,303], [304,319]],
        qAdress: [[256,271], [272,287], [288,303], [304,319]]        
}  

//Dados de Remota ficticia para teste em 21/01/2019
let remotaPn99 = 
{
        noCPs: 2, 
        modulo : 'E099C',
        dataRecDbsNs: [303,304],//Parametro: RCVRD
        dataSymblDbs:['UNI_RECV_CP4','UNI_RECV_CP8'], //Nome do data block do RCVRD
        nomeCPs :['E011C4-CP-ELE025', 'E011C8-CP-ELE025'],
        iAdress: [[256,271], [272,287] ],
        qAdress: [[256,271], [272,287] ],
        tipos: ['p122','p127','p225','p241','p243','p632'],//familias de Relés que efetivamente existem (reles esperados)
        numDBsLeituras: [401,402],//405,406,407,408],//numero das dbs onde estão as requisiçÕes de leitura daquela remotaa
        numDBsEscritas:[21,22],
        numCPs: [98,99],//,//2,3,4],///,2,3,4],//número dos CPs que pertence a aquela remotaa na aba do levantamento....
        numFCs: [30],//,31],//,31,32],//numero das FCs que fazem o rearranjo para o clp de elétrica
        nome: 'remotaPN99'          

}

// 0,1,2,3,4,5,6
let paineis = [
                remotaPn01,
                remotaPn02, 
                remotaPn03, 
                remotaPn08,
                remotaPn11,
                remotaPn99
        ]

const r = 'remotaPn03'

//remotas 01, 02, 03, 08 , 11, 0 ,1,2,3,4
exports.getRemota = function (r){
        var k = 0
        var remotas =[01,02,03,08,11,99]
        let remota_ = null
        paineis.forEach(remota =>{ 
                //console.log(remota)
                if(remotas[k] === parseInt(r.split('n')[1])){
                        remota_ =  remota
                }
                k++
        })
        return remota_
}        


//console.log(getRemota('remotaPn03'))