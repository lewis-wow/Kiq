/*

    calendar using Kiq, htm and moment.js
  
*/


const html = htm.bind(Kiq.createElement);

class Calendar extends Kiq.Component {

    width = this.props.width || 350;
    height = this.props.height || 350;

    styleTemplate = {
        width: this.width + "px",
        height: this.height + "px"
    };

    style = { ...this.styleTemplate, ...this.props.style };

    state = {
        dateContext: moment(),
        today: moment(),
        showMonthPopup: false,
        showYearPopup: false,
        showYearNav: false
    };

    weekdays = moment.weekdays();
    weekdaysShort = moment.weekdaysShort();
    months = moment.months();

    getYear = () => this.state.dateContext.format('Y');
    getMonth = () => this.state.dateContext.format('MMMM');
    getDaysInMonth = () => this.state.dateContext.daysInMonth();
    getCurrDate = () => this.state.dateContext.set('date');
    getFirstDayInMonth = () => moment(this.state.dateContext).startOf('month').format('d');

    onChangeMonth = (e, month) => {

        this.setState({

            showMonthPopup: !this.state.showMonthPopup

        });

    };

    setMonth = (month) => {

        let monthNo = this.months.indexOf(month);
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set('month', monthNo);

        this.setState({
            dateContext: dateContext
        });

    };

    onSelectChange = (e, data) => {

        this.setMonth(data);

        this.props.onMonthChange && this.props.onMonthChange();

    };

    SelectList = class extends Kiq.Component {

        Element(props, state) {

            const popup = props.data.map((data) => {

                return html`
                    <div _key=${ data }>
                        <a href="#" onclick=${ (e) => { props.onSelectChange(e, data); } }>
                            ${ data }
                        </a>
                    </div>
                `;

            });

            return html`
                <div className="month-popup">
                    ${ popup }
                </div>
            `;

        }

    }

    MonthNav = class extends Kiq.Component {

        Element(props, state) {

            return html`
                <span className="label-month" onclick=${ (e) => { props.onChangeMonth(e, props.getMonthFunction()) } }>
                    ${ props.getMonthFunction() }

                    ${ props.showMonthPopup ? 
                        html`<${ props.SelectListComponent } 
                            data=${ props.months }
                            onSelectChange=${ props.onSelectChange }
                        />` : '' }
                </span>
            `;

        }

    }

    showYearEditor = () => {

        this.setState({
            showYearNav: true
        });

    };

    setYear = (year) => {

        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set('year', year);

        this.setState({
            dateContext: dateContext
        });


    };

    onChangeYear = (e) => {

        this.setYear(e.target.value);

        this.props.onYearChange && this.props.onYearChange(e, e.target.value);

    };  

    onKeyUpYear = (e) => {

        if(e.which === 13 || e.which === 27) {

            this.setYear(e.target.value);

            this.setState({
                showYearNav: false
            });

        }

    };

    YearNav = class extends Kiq.Component {

        Element(props, state) {

            return props.showYearNav ? 
                html`<input 
                    _ref=${ (el) => {  } } 
                    className="editor-year" 
                    value=${ props.getYear() } 
                    type="number"
                    placeholder="year"
                    onkeyup=${ (e) => { props.onKeyUpYear(e); } }
                    onchange=${ (e) => { props.onChangeYear(e); } }
                />` 
                : 
                html`
                <span className="label-year" ondblclick=${ (e) => { props.showYearEditor() } }>
                    ${ props.getYear() }
                </span>
            `;

        }

    }


    Element(props, state) {

        let weekdays = this.weekdaysShort.map((day) => {

            return html`<td _key=${ day } className="week-day">${ day }</td>`;

        });

        let blanks = [];

        for(let i = 0; i < this.getFirstDayInMonth(); i++) {

            blanks.push(html`<td _key=${ i * 80 } className="empty-slot"></td>`);

        }

        let daysInMonth = [];

        for(let i = 1; i <= this.getDaysInMonth(); i++) {

            let classNm = (i === this.getCurrDate() ? "day current-day" : "day");

            daysInMonth.push(html`
                <td _key=${ i } className=${ classNm }>
                    <span>${ i }</span>
                </td>
            `);

        }

        const totalSlots = [...blanks, ...daysInMonth];
        let rows = [];
        let cells = [];

        totalSlots.forEach((row, i) => {

            if((i % 7) !== 0) {

                cells.push(row);

            } else {

                let insertRow = cells.slice();
                rows.push(insertRow);
                cells = [];
                cells.push(row);

            }

            if(i === totalSlots.length - 1) {

                let insertRow = cells.slice();
                rows.push(insertRow);

            }

        });

        let trElems = rows.map((row, i) => {

            return html`

                <tr _key=${ i * 100 }>
                    ${ row }
                </tr>

            `;

        });

        return html `
            <div className="calendar-container" style=${ this.style }>
                
                <table className="calendar">

                    <thead>
                        <tr className="calendar-header">
                            <td colSpan="5">

                                <${ this.MonthNav } 
                                    getMonthFunction=${ this.getMonth } 
                                    SelectListComponent=${ this.SelectList } 
                                    months=${ this.months }
                                    showMonthPopup=${ state.showMonthPopup }
                                    onChangeMonth=${ this.onChangeMonth }
                                    onSelectChange=${ this.onSelectChange }
                                />
                                ${" "}
                                <${ this.YearNav } 
                                    getYear=${ this.getYear }
                                    showYearEditor=${ this.showYearEditor }
                                    showYearNav=${ state.showYearNav }
                                    onChangeYear=${ this.onChangeYear }
                                    onKeyUpYear=${ this.onKeyUpYear }
                                />

                            </td>
                        </tr>
                    </thead>

                    <tbody>

                        <tr>
                            
                            ${ weekdays }

                        </tr>

                        ${ trElems }

                    </tbody>

                </table>
            
            </div>
        `;

    }

}
