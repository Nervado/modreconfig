reaj = require('./analisaRearranjo')
fcold = require('./analisaFC')

//escreve fc ......recebe um vetor de redes ....analisa cada uma e produz a fc 
exports.setFC = function setFC(redes, linhas_fcOld, numFC){
    let linhas = ''
    //console.log(redes.length)
    redes.forEach(rede => {        
        //analisa fc antiga
        //console.log(rede)
        fcold.getDadosUteisFCold(rede,linhas_fcOld,numFC)//o parâmetro do número da fc é passado para identificar a qual
        linhas += reaj.setLinhasRearanjo(rede,numFC)//FC da remota ele pertence      
        //console.log(linhas.length,numFC)

        })   
    let fc = 
`

FUNCTION FC${numFC} : VOID //FC de rearranjo para envio ao CLP de Elétrica
VAR
    tmp1: DINT;
    tmp2: DINT;
    tmp3: DINT;
END_VAR


BEGIN //code section           

${linhas}
   
END_FUNCTION`
if(linhas.length < 10){ fc =''}
return fc
}