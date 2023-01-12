        class ToggleButton extends Kiq.Component {

            isActive = false;

            toggleEvt = (e) => {

                this.isActive = !this.isActive;

                if(this.isActive) {

                    this.props.onActive && this.props.onActive(e);

                }

                this.props.onClick && this.props.onClick(e, this.isActive);

            };

            Element(props, state) {

                return (
                    <button onclick={ this.toggleEvt } style={ props.style || {}}>
                        { props.children }
                    </button>
                );

            }

        }
        
        /*
          HOW TO USE:
        */
        
        <ToggleButton onActive={ (e) => console.log('active') } style={{ color: 'red' }}>
          Click me
        </ToggleButton>
