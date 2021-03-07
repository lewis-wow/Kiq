class List extends Kiq.Component {

    state = {
        arr: [{
            id: 0,
            val: 0
        }, {
            id: 1,
            val: 1
        }, {
            id: 2,
            val: 2
        }, {
            id: 3,
            val: 3
        }],
        sort: false
    };

    onComponentRender() {

        setTimeout(() => {
            this.setState({
                arr: [{
                    id: 0,
                    val: 0
                }, {
                    id: 1,
                    val: 1
                }, {
                    id: 2,
                    val: 2
                }, {
                    id: 4,
                    val: 44
                }, {
                    id: 3,
                    val: 3
                }]
            });
        }, 1500);

        setTimeout(() => {
            this.setState({
                arr: [...this.state.arr].sort((a, b) => a.val - b.val) //[{ id: 0, val: 2 }, { id: 1, val: 3 }, { id: 2, val: 5 }, { id: 4, val: 3 }, { id: 3, val: 44 }]
            });
        }, 3000);

        setTimeout(() => {
            this.setState({
                arr: [...this.state.arr].reverse() //[{ id: 0, val: 2 }, { id: 1, val: 3 }, { id: 2, val: 5 }, { id: 4, val: 3 }, { id: 3, val: 44 }]
            });
        }, 4500);

        setTimeout(() => {
            this.setState({
                arr: [{
                    id: 1,
                    val: 1
                }, {
                    id: 0,
                    val: 0
                }, {
                    id: 4,
                    val: 44
                }]
            });
        }, 6000);

        setTimeout(() => {
            this.setState({
                arr: [{
                    id: 0,
                    val: 0
                }, {
                    id: 1,
                    val: 1
                }, {
                    id: 4,
                    val: 44
                }]
            });
        }, 7500);

        setTimeout(() => {
            this.setState({
                arr: [...this.state.arr].reverse()
            });
        }, 9000);

        setTimeout(() => {
            this.setState({
                arr: [{
                    id: 0,
                    val: 0
                }, {
                    id: 1,
                    val: 1
                }, {
                    id: 4,
                    val: 44
                }, {
                    id: 5,
                    val: 55
                }]
            });
        }, 10500);

        setTimeout(() => {
            this.setState({
                arr: [{
                    id: 5,
                    val: 55
                }, {
                    id: 0,
                    val: 0
                }, {
                    id: 1,
                    val: 1
                }, {
                    id: 4,
                    val: 44
                }]
            });
        }, 12000);

        setTimeout(() => {
            this.setState({
                arr: [...this.state.arr].sort((a, b) => a.val - b.val)
            });
        }, 13500);




    }

    Element(props, state) {

        console.log(state.arr);

        return html`<ul>${ state.arr.map((item, i) => {

                    return html`<input value=${ item.val } />`;

                }) }</ul>`;

    }

}
