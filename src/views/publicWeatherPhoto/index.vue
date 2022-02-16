<script>
import blizzard from '@/assets/weather/blizzard.png'
import cloudy from '@/assets/weather/cloudy.png'
import dust from '@/assets/weather/dust.png'
import duststorm from '@/assets/weather/duststorm.png'
import foggy from '@/assets/weather/foggy.png'
import hail from '@/assets/weather/hail.png'
import haze from '@/assets/weather/haze.png'
import heavyrain from '@/assets/weather/heavyrain.png'
import heavysnow from '@/assets/weather/heavysnow.png'
import lightrain from '@/assets/weather/lightrain.png'

import lightsnow from '@/assets/weather/lightsnow.png'
import moderaterain from '@/assets/weather/moderaterain.png'
import moderatesnow from '@/assets/weather/moderatesnow.png'
import overcast from '@/assets/weather/overcast.png'
import sand from '@/assets/weather/sand.png'
import shower from '@/assets/weather/shower.png'
import sleet from '@/assets/weather/sleet.png'
import snowflurry from '@/assets/weather/snowflurry.png'
import storm from '@/assets/weather/storm.png'
import sunny from '@/assets/weather/sunny.png'
import thundershower from '@/assets/weather/thundershower.png'

export default {
  data() {
    return {
      weatherPhoto: {
        '晴': sunny,
        '多云': cloudy,
        '阴': overcast,
        '阵雨': shower,
        '雷阵雨': thundershower,
        '雷阵雨伴有冰雹': thundershower,
        '雨夹雪': sleet,
        '小雨': lightrain,
        '中雨': moderaterain,
        '冻雨': hail,
        '大雨': heavyrain,
        '暴雨': storm,
        '大暴雨': storm,
        '特大暴雨': storm,
        '阵雪': snowflurry,
        '小雪': lightsnow,
        '中雪': moderatesnow,
        '大雪': heavysnow,
        '暴雪': blizzard,
        '雾': foggy,
        '浮尘': dust,
        '扬沙': sand,
        '沙尘暴': duststorm,
        '强沙尘暴': duststorm,
        '霾': haze
      }
    }
  }
}
</script>
