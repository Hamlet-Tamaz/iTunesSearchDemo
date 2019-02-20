<template>
  <div>
    <h1>iTunes Search Demo</h1>
    
    <!-- TAB NAV -->
    <div id='tab-nav'>
      <h3 id='tab-search' class='tab' :class="{activeTab: searchTab}"    @click="tab('search')">Search</h3>
      <h3 id='tab-favorites' class='tab' :class="{activeTab: favoritesTab}" @click="tab('favorites')">
        <span>Favorites</span>
        <span id='clear-favorites' @click='clearFavorites'>Clear</span>
      </h3>
    </div>
    
    <!-- SEARCH SCREEN -->
    <div id='search-content' v-if="searchTab == true">
      <input id="search-input" type="text" v-on:keyup.enter="search" v-model='searchInput'>
      <button id='search-button' @click='search'>Search</button>

      <p v-if='this.searchResults.count'>You can click an image to navigate to it's preview.</p>

      <ul id='results'>
        <li v-for="(section, i) in searchResults.kinds" :key="i">
          <div class='kind-box'>
            <h3>
              <u>{{ cleanKind(i) }}<span v-if="section.length > 1 && i != 'undefined'">s</span> </u>
              <br>
              <!-- <span class='dropdown' @click='toggleDropdown("section-"+i)'>V</span> -->
              <img 
                src="../assets/caret-down.jpg"
                class='dropdown' 
                @click='toggleDropdown("section-"+i)'
              >
            </h3>
            
            <ul :id='"section-"+i' class='section'>
              <li v-for='(item, i) in section' :key="i" class="tile"> 

                <div class='tile-top'>
                  <a :href="item.trackViewUrl" target="_blank">
                    <img class='tile-image' :src="item.artworkUrl100" >
                  </a>

                  <div>
                    <img 
                      v-if='isFavorite(item.id)' 
                      src="../assets/heart-full.jpg"
                      class='heart' 
                      @click='toggleFavorite(item, "search")'
                    >
                    <img 
                      v-else 
                      src="../assets/heart-empty.jpg"
                      class='heart' 
                      @click='toggleFavorite(item, "search")'
                    >
                  </div>
                </div>
                
                <div class='tile-details'>
                  <table>
                    <tr v-if='item.artistName'>
                      <td><b> Artist: </b></td>
                      <td>{{item.artistName}}</td>
                    </tr>
                    <tr v-if='item.trackName'>
                      <td><b> Track: </b></td>
                      <td>{{item.trackName}}</td>
                    </tr>
                    <tr v-if='item.collectionName'>
                      <td><b> Album: </b></td>
                      <td>{{item.collectionName}}</td>
                    </tr>
                    <tr v-if='item.primaryGenreName'>
                      <td><b> Genre: </b></td>
                      <td>{{item.primaryGenreName}}</td>
                    </tr>
                    <tr v-if='item.id'>
                      <td><b> ID: </b></td>
                      <td>{{item.id}}</td>
                    </tr>
                  </table>
                </div>

              </li>
            </ul>

          </div>
        </li>
      </ul>
    </div>

    <!-- FAVORITES SCREEN -->
    <div id='favorites-content' v-if="favoritesTab == true">
      <p v-if='Object.keys(this.favorites).length'>You can click an image to navigate to it's preview.</p>

      <ul>
        <li id='noFavorites' v-if='Object.keys(favoritesByKind).length == 0'>
          <h2>You have no favorites :( </h2>
          <h4>Mark the heart icon from the search section to save items for later and to display them here.</h4>
        </li>

        <li v-for="(section, i) in favoritesByKind" :key="i">
          <div class='kind-box'>
            <h3>
              <u>{{ cleanKind(i) }}<span v-if="section.length > 1 && section.kind != 'undefined'">s</span></u>
              <br>
              <!-- <span class='dropdown' @click='toggleDropdown("section-"+i)'>V</span> -->
              <img 
                src="../assets/caret-down.jpg"
                class='dropdown' 
                @click='toggleDropdown("section-"+i)'
              >
            </h3>
            
            <ul :id='"section-"+i' class='section'>
              <li v-for='(item, i) in section' :key="i" class="tile"> 

                <div class='tile-top'>
                  <a :href="item.trackViewUrl" target="_blank">
                    <img class='tile-image' :src="item.artworkUrl100" >
                  </a>

                  <div>
                    <img 
                      v-if='isFavorite(item.id)' 
                      src="../assets/heart-full.jpg"
                      class='heart' 
                      @click='toggleFavorite(item, "favorites")'
                    >
                    <img 
                      v-else 
                      src="../assets/heart-empty.jpg"
                      class='heart' 
                      @click='toggleFavorite(item, "favorites")'
                    >
                  </div>
                </div>
                
                <div class='tile-details'>
                  <table>
                    <tr v-if='item.artistName'>
                      <td><b> Artist: </b></td>
                      <td>{{item.artistName}}</td>
                    </tr>
                    <tr v-if='item.trackName'>
                      <td><b> Track: </b></td>
                      <td>{{item.trackName}}</td>
                    </tr>
                    <tr v-if='item.collectionName'>
                      <td><b> Album: </b></td>
                      <td>{{item.collectionName}}</td>
                    </tr>
                    <tr v-if='item.primaryGenreName'>
                      <td><b> Genre: </b></td>
                      <td>{{item.primaryGenreName}}</td>
                    </tr>
                    <tr v-if='item.id'>
                      <td><b> ID: </b></td>
                      <td>{{item.id}}</td>
                    </tr>
                  </table>
                </div>

              </li>
            </ul>

          </div>
        </li>
      </ul>
    </div>
    

  </div>
</template>

<script>
export default {
  name: 'itunes-search-demo',
  data() {
    return {
      searchResults: {},
      favorites: JSON.parse(localStorage.demoSearchFavorites),
      searchTab: true,
      favoritesTab: false,
      searchInput: ''
    }
  },
  computed: {
    favoritesByKind() {
      let unordered = {};
      const f = this.favorites;

      for (var el in f ) {
        if (!unordered[f[el].kind]) unordered[f[el].kind] = [];

        unordered[f[el].kind].push(f[el]);
      }

      const ordered = {};
      Object.keys(unordered).sort().forEach(function(key) {
        ordered[key] = unordered[key];
      });

      return ordered;
    }
  },
  created() {
    /* this.$http.get('http://localhost:8081/search:test', (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        console.log(JSON.parse(data).explanation);
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    }); */
  },
  methods: {
    tab(tab) {
      if (tab == 'search') {
        this.searchTab = true;
        this.favoritesTab = false;
      } else if (tab == 'favorites') {
        this.searchTab = false;
        this.favoritesTab = true;
      }
    },
    search() {
      this.$http.post('http://localhost:3002/search', {
        term: document.getElementById('search-input').value
        })
        .then((res)=> {
          this.$set(this, 'searchResults', res.data);
        })
        .catch((err)=> {
          console.log('err: ', err); // this would be removed in a production app
          alert('The search failed. Please try again.');
        });
    },
    isFavorite(id) {
      return this.favorites[id];
    },
    clearFavorites() {
      this.$set(this, 'favorites', {});
      localStorage.setItem('demoSearchFavorites', JSON.stringify({}));
    },
    toggleFavorite(item, opt) {
      if (this.favorites[item.id]) {
        let conf = true;
        if (opt == 'favorites') conf = confirm('Are you sure you want to remove item from favorites?');
        if (conf == true) this.$delete(this.favorites, item.id);
      } else {
        this.$set(this.favorites, item.id, item);
      }

      let f_string = JSON.stringify(this.favorites);

      localStorage.setItem('demoSearchFavorites', f_string );
    },
    toggleDropdown(id) {
      const elem = document.getElementById(id);

      if (elem.style.display != 'flex') {
        elem.style.display = 'flex';
        event.target.classList.add('flip');
      } else {
        elem.style.display = 'none';
        event.target.classList.remove('flip');
      }
    },
    capFL: function (str) { return str.charAt(0).toUpperCase() + str.slice(1); },
    cleanKind: function (str) { 
      let res = '';

      if (str == 'undefined') {
        res = "Miscellaneous / No Kind Provided";
      } else {
        res = str.split('-');
        res = res.map( el => {
          return el.charAt(0).toUpperCase() + el.slice(1); 
        });
        
        res = res.join(' ');
      }
      return res;
    },
  },
}
</script>

<style>
#tab-nav {
  display: flex;
  margin: 10px 15px 20px;
}

.tab {
  height: 50px;
  width: 100%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border: .5px solid #52A1F7;
  position: relative;
}

#tab-search {
  border-radius: 10px 0 0 10px;
}

#tab-favorites {
  border-radius: 0 10px 10px 0;
}

.activeTab {
  background-color: #52A1F7;
  color: white;
}

#clear-favorites {
  color: white;
  position: absolute;
  right: 0;
  background-color: #FB5A5B;
  border-radius: 0 10px 10px 0;
  height: 102%;
  align-items: center;
  display: flex;
  padding: 0 10px;
}

@media (max-width: 500px) {
  #tab-favorites {
    justify-content: left;
    padding-left: 15px;
  }
}

#search-content, #favorites-content {
  margin: 0 15px;
}

#search-input, #search-button {
  font-size: large;
  padding: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

.kind-box {
  border: 1px solid black;
  border-radius: 10px;
  margin: 20px 0;
  padding: 10px;
}

.dropdown {
  cursor: pointer;
  width: 50px;
  margin-top: 25px;
}

.flip {
  transform: rotate(180deg);
}

.section {
  display: none;
  flex-wrap: wrap;
  list-style-type: none;
  justify-content: space-evenly;
}

.tile {
  display: block;
  position: relative;
  border: .5px solid grey;
  border-radius: 10px;
  margin: 10px 20px;
  padding: 10px;
  width: 250px;
}

.tile > a {
  text-decoration: none;
  color: black;
}

.tile-top {
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid black;
  padding: 10px 0 20px;
}

.tile-top > img {
  cursor: pointer;
}

.tile-image {
  min-width: 100px;
}

.tile-details {
  text-align: left;
  display: inline;
}

.heart {
  width: 50px;
  position: relative;
  top: 25px;
  cursor: pointer;
}

#noFavorites {
  margin-top: 75px;
}

</style>
