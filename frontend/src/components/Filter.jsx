const Filter = (props) => (
    <div>
        filter shown with: 
        <input value={props.filter} onChange={props.onChange}/>
    </div>
)
export default Filter