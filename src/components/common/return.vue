<template>
    <el-page-header @back="goBack" content="详情页面" class="return">
    </el-page-header>
</template>
<script>
export default {
    nama:'returnH',
    methods: {
      goBack() {
        console.log('go back');
      }
    }
}
</script>
<style lang="scss" scoped>
    .return{
        background: #2196F3;
        
    }
</style>