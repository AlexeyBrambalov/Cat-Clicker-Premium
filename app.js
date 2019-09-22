document.addEventListener('DOMContentLoaded', function(event) {
  const model = {
    init: function() {
      let imgList = [];
      const imgNames = ['Fluffy', 'Wuffy', 'Stuffy', 'Puffy', 'Buffy'];
      const catImages = [
        'https://cdn.pixabay.com/photo/2017/07/25/01/22/cat-2536662__340.jpg',
        'https://cdn.pixabay.com/photo/2018/03/27/17/25/cat-3266673__340.jpg',
        'https://cdn.pixabay.com/photo/2019/06/18/11/32/cat-4282123__340.jpg',
        'https://cdn.pixabay.com/photo/2016/12/18/18/42/kittens-1916542__340.jpg',
        'https://cdn.pixabay.com/photo/2015/11/07/11/34/kitten-1031261__340.jpg'
      ];
      for (var i = 0; i < imgNames.length; i++) {
        let clicks = 0;

        imgListObj = {
          imageSrc: catImages[i],
          name: imgNames[i],
          clicks: 0
        };
        imgList.push(imgListObj);
      }

      modelData = {
        imgList: imgList,
        selected: 0,
        adminOn: false
      };
    },
    getCatlist: function() {
      return modelData.imgList;
    },
    getSelected: function() {
      return modelData.selected;
    },
    addClick: function(index) {
      modelData.imgList[index].clicks++;
    },
    setSelected: function(index) {
      return (modelData.selected = index);
    },
    isAdminOn: function() {
      return modelData.adminOn;
    },
    toggleAdmin: function(toggle) {
      if (toggle) {
        modelData.adminOn = toggle;
      } else {
        modelData.adminOn = !modelData.adminOn;
      }

      return modelData.adminOn;
    },
    saveCat: function(index, newCat) {
      var cat = modelData.imgList[index];
      cat.name = newCat.name;
      cat.imageSrc = newCat.imageSrc;
      cat.clicks = newCat.clicks;
      modelData.imgList[index] = cat;

      return cat;
    }
  };

  const octopus = {
    getCats: function() {
      return model.getCatlist();
    },
    addClick: function(catIndex) {
      model.addClick(catIndex);
      detailsView.render();
    },
    getClicks: function(catIndex) {
      return model.getCatlist()[catIndex].clicks;
    },
    getSelected: function() {
      return model.getSelected();
    },
    setSelected: function(index) {
      return model.setSelected(index);
    },
    toggleAdmin: function(toggle) {
      return model.toggleAdmin(toggle);
    },
    isAdminOn: function() {
      return model.isAdminOn();
    },
    saveCat: function(index, cat) {
      return model.saveCat(index, cat);
    },
    init: function() {
      model.init();
      listView.init();
      detailsView.init();
      adminView.init();
    }
  };

  const listView = {
    init: function() {
      this.catlist = document.querySelector('#catlist');
      this.render();
    },
    render: function() {
      // Clear the list of cats
      while (this.catlist.firstChild) {
        this.catlist.removeChild(this.catlist.firstChild);
      }

      octopus.getCats().forEach(function(cat, index) {
        let catlistItem = document.createElement('li');
        catlistItem.textContent = cat.name;

        catlistItem.addEventListener('click', function(event) {
          octopus.setSelected(index);
          detailsView.render();
        });

        this.catlist.appendChild(catlistItem);
      });
    }
  };

  const detailsView = {
    init: function() {
      this.catdetails = document.querySelector('#catdetails');
      this.catname = document.querySelector('#catname');
      this.catclicks = document.querySelector('#catclicks');
      this.catimage = new Image();

      this.catimage.addEventListener('click', function(event) {
        octopus.addClick(octopus.getSelected());
      });

      this.render();
    },
    render: function() {
      let selectedIndex = octopus.getSelected();
      this.selectedCat = octopus.getCats()[selectedIndex];

      this.catname.textContent = this.selectedCat.name;
      this.catimage.src = this.selectedCat.imageSrc;

      this.catclicks.textContent = octopus.getClicks(selectedIndex);

      let currentImage = document.querySelector('#catdetails > img');
      this.catdetails.appendChild(this.catimage);
      adminView.render();
    }
  };

  const adminView = {
    init: function() {
      this.adminform = document.querySelector('#adminform');
      this.adminButton = document.querySelector('#adminButton');
      this.nameinput = document.querySelector('#nameinput');
      this.urlinput = document.querySelector('#urlinput');
      this.clicksinput = document.querySelector('#clicksinput');

      this.save = document.querySelector('#save');
      this.cancel = document.querySelector('#cancel');

      this.save.addEventListener('click', function(event) {
        event.preventDefault();

        let newCat = {
          name: adminView.nameinput.value,
          imageSrc: adminView.urlinput.value,
          clicks: adminView.clicksinput.value
        };

        octopus.saveCat(octopus.getSelected(), newCat);
        listView.render();
        detailsView.render();
        adminView.render();
      });

      this.cancel.addEventListener('click', function(event) {
        event.preventDefault();

        octopus.toggleAdmin(false);
        adminView.render();
      });

      this.adminButton.addEventListener('click', function(event) {
        octopus.toggleAdmin();
        adminView.render();
      });

      this.render();
    },
    render: function() {
      var selectedIndex = octopus.getSelected();
      var selectedCat = octopus.getCats()[selectedIndex];

      this.nameinput = document.querySelector('#nameinput');
      this.urlinput = document.querySelector('#urlinput');
      this.clicksinput = document.querySelector('#clicksinput');

      if (octopus.isAdminOn()) {
        adminform.style.display = 'block';

        this.nameinput.value = selectedCat.name;
        this.urlinput.value = selectedCat.imageSrc;
        this.clicksinput.value = selectedCat.clicks;
      } else {
        adminform.style.display = 'none';
      }
    }
  };

  octopus.init();
});
