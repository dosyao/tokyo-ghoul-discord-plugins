//META{"name":"ImGhoulStatus"}*//

class ImGhoulStatus {
    status = '';
    text = '';
    backspaceTime = 200;
    animationTime = 600;
    bogieRelay = 400;
    isNeedIncrement = true;
    
    /* BD functions */
    getName() {
      return 'ImGhoulStatus';
    }
    getVersion() {
      return '0.0.1';
    }
    getAuthor() {
      return 'vnahornyi';
    }
    getDescription() {
      return 'Animated I\'m ghoul status';
    }
    setData(key, value) {
      BdApi.setData(this.getName(), key, value);
    };
    getData(key) {
      return BdApi.getData(this.getName(), key);
    };
  
  /* Code related to Animations */
    load() {
      Status.authToken = this.getData('token');
      this.text = this.getData('text');
    };
  
    start() {
      if (Status.authToken !== undefined && this.text.length) {
        this.mainAnimation();
        this.bogieStatusAnimation();
      }
    };
  
    stop() {
      clearTimeout(this.loop);
      clearTimeout(this.bogieLoop);
      Status.unset();
    }

    mainAnimation() {
      this.isNeedIncrement ? this.incrementStatusAnimation() : this.decrementStatusAnimation();

      this.loop = setTimeout(() => {
        this.mainAnimation();
      }, this.isNeedIncrement ? this.animationTime : this.backspaceTime);
    }
  
    incrementStatusAnimation() {
      if (this.status === this.text) {
        this.isNeedIncrement = false;

        return;
      }

      if (this.status.length <= this.text.length) {
        if (this.status[this.status.length - 1] === '|') {
          this.status = this.status.split('|').shift();
          this.status += `${this.text[this.text.length - (this.text.length - (this.status.length  ?? 1))]}|`;
        } else {
          this.status += this.text[this.text.length - (this.text.length - (this.status.length  ?? 1))];
        }
      }
      
      Status.set(this.status);
    }

    decrementStatusAnimation() {
      this.isNeedIncrement = false;
      this.status = this.status.substr(0, this.status.length - (this.status[this.status.length - 1] === '|' ? 2 : 1));

      Status.set(this.status);

      if (!this.status.length) {
        this.isNeedIncrement = true;
      }
    }

    bogieStatusAnimation() {
      this.status = this.status.includes('|') ? this.status.substr(0, this.status.length - 1) : `${this.status}|`;

      Status.set(this.status);

      this.bogieLoop = setTimeout(() => {
        this.bogieStatusAnimation();
      }, this.bogieRelay);
    }
  
  /* Settings related functions */
    getSettingsPanel() {
      const settings = document.createElement('div');
  
      settings.style.padding = '10px';
  
      // Auth Token
      settings.appendChild(GUI.newLabel('AuthToken (https://discordhelp.net/discord-token)'));
  
      const token = GUI.newInput();
  
      token.value = this.getData('token');
  
      settings.appendChild(token);
      settings.appendChild(GUI.newDivider());
  
        //displayed status
        settings.appendChild(GUI.newLabel('Set status'));

        const text = GUI.newInput();

        text.value = this.getData('text');

        settings.appendChild(text);
        settings.appendChild(GUI.newDivider());

      // Save Btn
      settings.appendChild(GUI.newDivider());
  
      const save = GUI.newButton('Save');
  
      save.onclick = () => {
        this.setData('token', token.value);
        this.setData('text', text.value);
  
        this.stop();
        this.load();
        this.start();
      };
  
      settings.appendChild(save);
  
      return settings;
    };
  }
  
  /* Status API */
  const Status = {
    authToken: '',
    request: () => {
      let req = new XMLHttpRequest();
  
      req.open('PATCH', '/api/v6/users/@me/settings', true);
      req.setRequestHeader('authorization', Status.authToken);
      req.setRequestHeader('content-type', 'application/json');
  
      return req;
    },
    set: status => {
      Status.request().send(`{ "custom_status": { "text": "${status}", "emoji_name": null }}`);
    },
    unset: () => {
      Status.request().send('{ "custom_status": null }');
    }
  };
  
  /* GUI Wrapper */
  const GUI = {
    newInput: () => {
      const input = document.createElement('input');
  
      input.className = 'inputDefault-_djjkz input-cIJ7To';
  
      return input;
    },
    newLabel: text => {
      const label = document.createElement('h5');
  
      label.className = 'h5-18_1nd';
      label.innerText = text;
  
      return label;
    },
    newDivider: () => {
      const divider = document.createElement('div');
  
      divider.style.paddingTop = '15px';
  
      return divider;
    },
    newButton: text => {
      const button = document.createElement('button');
  
      button.className = 'button-38aScr lookFilled-1Gx00P colorBrand-3pXr91 sizeSmall-2cSMqn';
      button.innerText = text;
  
      return button;
    }
  };
  
