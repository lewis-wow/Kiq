        Kiq.Hook = function(initVal) {

            let that;

            class HookComponent extends Kiq.Component {

                constructor(props) {

                    super(props);

                    this.state = { ...initVal };

                    that = this;

                }

                Element(props, state) {

                    return props.Element(props, state);

                }

            }

            function setStateHook(newState) {

                Object.assign(that.state, newState);

                that.setState({ ...that.state });

            }

            return [HookComponent, setStateHook];

        }
  
        //HOW TO USE:

        /*const [LocalStyle, setStyle] = Kiq.Hook({
            color: 'red'
        });


        Kiq.render(html`<${ LocalStyle } Element=${ (props, state) => html`<div>${ state.color }</div>` } />`, document.getElementById('app'), () => {
            
            setTimeout(() => {
                setStyle({
                    color: 'blue'
                });
            }, 1500);
            
        });*/
