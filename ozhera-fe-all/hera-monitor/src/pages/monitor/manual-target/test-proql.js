import server from "@/api/service/manual-target"
export function testPromQL(promql){
  server.manualTestPromQLApi({promql}).then(res=>{
    window.open(res);
  })
}