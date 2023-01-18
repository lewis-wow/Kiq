        Kiq.Async = class extends Kiq.Component {

            state = {
                isResolved: false,
                promiseResult: null,
                errorWasCatched: false
            };

            onComponentRender() {

                this.props.await.then(res => {

                    this.setState({
                        isResolved: true,
                        promiseResult: res
                    });

                }).catch(err => {

                    this.setState({
                        errorWasCatched: true,
                        promiseResult: err
                    });

                });

            }

            Element(props, state) {

                if(state.errorWasCatched) {

                    return props.catch(state.promiseResult);

                }

                if (state.isResolved) {

                    return props.then(state.promiseResult);

                }

                return props.fallback;

            }

        }

        //how to use
        /** @jsx Kiq.createElement */

        <Kiq.Async 
            await={ promise } 
            fallbak={ <div>Loading...</div> }
            then={ (res) => <div>{ res }</div> }
            catch={ (err) => <div style={{ color: "red"}}>{ err }</div> }
         />
