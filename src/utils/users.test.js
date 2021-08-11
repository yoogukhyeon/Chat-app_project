const expect = require('expect');


const {Users} = require('./users')


describe('Users' , () => {
    let users;


    beforeEach(() => {
        users = new Users();
        users.users = [{
       
            id : "1",
            name : "yoo",
            room : "node.js"
          
            },{
            
            id : "2",
            name : "kim",
            room : "npm.js"
        
            },
            {
       
            id : "3",
            name : "pack",
            room : "react.js"
  
    }
    ]
    })

    it('should add new user' , () => {
        let users = new Users()
        let user = {
            id : "3",
            name : "pack",
            room : "react.js"
        }

        let reUser = users.addUser(user.id , user.name , user.room);


        expect(users.users).toEqual([user]);
    })

    it('should return names for the office fans' , () => {
        let userList = users.getUserList('react.js');
    
    
        expect(userList).toEqual(['pack']);
    })

    it('should return names for the office fans' , () => {
        let userList = users.getUserList('npm.js');
    
    
        expect(userList).toEqual(['kim']);
    })

    it('should find user' , () => {
        let userID = '2',
        user = users.getUser(userID);


        expect(user.id).toBe(userID)
    })

    it('should not find user' , () => {
        let userID = '150',
        user = users.getUser(userID);


        expect(user).toBeUndefined();
    })


    it('should not remove a user' , () => {
        let userID = '108',
            user = users.removeUser(userID);

            expect(user).toBeUndefined()
            expect(users.users.length).toBe(3)
    })

    
    it('should remove a user' , () => {
        let userID = '1',
            user = users.removeUser(userID);

            expect(user.id).toBe(userID)
            expect(users.users.length).toBe(2)
    })


 
})