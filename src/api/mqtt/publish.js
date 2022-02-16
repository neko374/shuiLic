import request from '@/utils/request'

export function mqttPublishGet(data) {
  return request({
    url: '/sys/aipowermqttpublish/get',
    method: 'post',
    data
  })
}

export function mqttPublishPublish(data) {
  return request({
    url: '/sys/aipowermqttpublish/publish',
    method: 'post',
    data
  })
}

/*
/sys/aipowermqttpublish/get
{
	"id": "PSK_001",
  	"msgType":"yk_1_1,yk_2_0,yt_2_201"
}

返回值
{
  "msg": "success",
  "code": 0,
  "getMsg": {

    "content": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<mqttData>\r\n<Session id=\"20200212234704\"/>\r\n<DataCollector id=\"PSK_001\">\r\n<type Type=\"Yk\">\r\n<yk pId=\"1\">1</yk>\r\n<yk pId=\"2\">0</yk>\r\n</type>\r\n<type Type=\"Yt\">\r\n<yt pId=\"2\">201</yt>\r\n</type>\r\n</DataCollector>\r\n</Session>\r\n</mqttData>"

  }
}

/sys/aipowermqttpublish/publish
{
	"broker": "tcp://47.103.79.116:1883",
  	"clientID":"aipower_clie",
	"topic": "ncyt_sub_yk_yt",
	"msgType": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<mqttData>\r\n<Session id=\"20200212221323\"/>\r\n<DataCollector id=\"0\">\r\n<type Type=\"Yk\">\r\n<yk pId=\"1\">0</yk>\r\n<yk pId=\"2\">1</yk>\r\n</type>\r\n<type Type=\"Yt\">\r\n<yt pId=\"1\">210</yt>\r\n</type>\r\n</DataCollector>\r\n</Session>\r\n</mqttData>\r\n"
}
*/
