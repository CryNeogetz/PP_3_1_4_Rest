package ru.kata.spring.boot_security.demo.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminRestController {

    private final UserService userService;
    private final RoleService roleService;


    @Autowired
    public AdminRestController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }


    @GetMapping()
    public ResponseEntity<List<User>> getUsers() {

        List<User> allUsers = userService.allUsers();

        return allUsers != null
                ? new ResponseEntity<>(allUsers, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable("id") int id) {
        User user = userService.findUserById(id);
        return user != null
                ? new ResponseEntity<>(user, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User newUser) {
        userService.saveUser(newUser);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping(value = "{id}")
    public ResponseEntity<?> updateUser(@RequestBody User updateUser) {
        userService.updateUser(updateUser);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable("id") int id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getRoles() {
        List<Role> roles = roleService.findAll();
        return roleService.findAll() != null
                ? new ResponseEntity<>(roles, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }


//
//    @PatchMapping("/{id}")
//    public String updateUser(@ModelAttribute("user") User user) {
//
//        userService.updateUserById(user);
//        return "redirect:/admin";
//    }
//
//    @DeleteMapping("/{id}")
//    public String deleteUser(@PathVariable("id") int id) {
//        userService.deleteUser(id);
//        return "redirect:/admin";
//    }
//
//    @PostMapping("/registration")
//    public String createUser(@ModelAttribute("newUser") User user) {
//        userService.saveUser(user);
//        return "redirect:/admin";
//    }

}
