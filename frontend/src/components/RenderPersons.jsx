const RenderPersons = ({persons, filter, deletePerson}) => (
    <div>
        {persons.map( (person) => {
            if (person.name.toLowerCase().includes(filter)) {
                return (
                    <div key={person.id}>
                        <p>{person.name} {person.number} </p>
                        <button onClick={() => deletePerson(person)}>delete</button>
                    </div>   
                )
            }
            return null
        })}
    </div>    
)

export default RenderPersons
