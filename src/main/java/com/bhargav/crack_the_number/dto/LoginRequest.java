package com.bhargav.crack_the_number.dto;

public class LoginRequest {
    private String username;
    public String getUsername(){
        return username;
    }
    public void setUsername(String username){
        this.username = username;
    }

    private String password;
    public String getPassword(){
        return password;
    }
    public void setPassword(String password){
        this.password = password;
    }

}
