package com.bhargav.crack_the_number.controller;

import com.bhargav.crack_the_number.dto.StatsResponse;
import com.bhargav.crack_the_number.model.Difficulty;
import com.bhargav.crack_the_number.model.User;
import com.bhargav.crack_the_number.service.GameService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/game")
public class GameController {

    @Autowired
    private GameService gameService;

    @PostMapping("/start")
    public String start(HttpServletRequest request,
                        @RequestParam Difficulty difficulty) {
        User user = (User) request.getAttribute("user");
        return gameService.startGame(user, difficulty);
    }

    @PostMapping("/guess")
    public String guess(HttpServletRequest request,
                        @RequestParam int guess) {
        User user = (User) request.getAttribute("user");
        return gameService.checkGuess(user, guess);
    }

    @PostMapping("/forfeit")
    public String forfeit(HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        return gameService.forfeit(user);
    }

    @GetMapping("/stats")
    public StatsResponse stats(HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        return gameService.getStats(user);
    }
}