<template>
	<link rel="icon" href="assets/pictures/logos/logo1.png" type="image/png">
	<div id="opacity-bg" style="position: fixed; width: 100%; height: 100%; transition: 0.5s"></div>
	<div id="opacity-bg1" style="position: fixed; width: 100%; height: 100%; transition: 0.5s"></div>
	<router-view/>
</template>

<script>
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin: 0;
	padding: 0;
  height: 100%;
}

::-webkit-scrollbar {
	display: none;
}

#opacity-bg, #opacity-bg1 {
	z-index: -1;
  height: 100%;
}

html, body {

	margin: 0;
	padding: 0;
  height: 100%;
  width: 100%;
	overflow: hidden;
}

</style>