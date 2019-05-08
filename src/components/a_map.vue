<template>
  <div class="a-map" id="a-map"></div>
</template>
<script>
import AMap from '@/utils/aMap.js'

export default {
  props: {
    lngLat: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      map: null,
      geocoder: null,
      marker: null
    }
  },
  mounted () {
    this.initMap()
  },
  methods: {
    removeMarker () {
      this.map.remove(this.marker)
    },
    setMarker () {
      const { lng, lat } = this.lngLat
      this.marker && this.map.remove(this.marker)
      this.marker = new AMap.Marker({
        position: new AMap.LngLat(lng, lat)
      })
      this.map.add(this.marker)
    },
    initMap () {
      this.map = new AMap.Map('a-map', {
        zoom: 10
      })
      this.geocoder = new AMap.Geocoder()

      this.map.on('click', ({ lnglat }) => {
        const { lng, lat } = lnglat

        this.marker && this.removeMarker()
        this.marker = new AMap.Marker({
          position: new AMap.LngLat(lng, lat)
        })
        this.map.add(this.marker)

        this.geocoder.getAddress([lng, lat], (status, result) => {
          if (status !== 'complete' || !result.regeocode) return window.alert(JSON.stringify(result))
          this.$emit('updateAddress', result.regeocode.formattedAddress, {lng, lat})
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.a-map {
  width: 100%;
  height: 200px;
}
</style>
