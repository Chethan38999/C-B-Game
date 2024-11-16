package com.Cows_and_Bulls_Game_api.Controller;

import com.Cows_and_Bulls_Game_api.Model.Score;
import com.Cows_and_Bulls_Game_api.Model.User;
import com.Cows_and_Bulls_Game_api.Repo.ScoreRepo;
import com.Cows_and_Bulls_Game_api.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/scores")
@CrossOrigin
public class ScoreController {

    private final ScoreRepo scoreRepository;
    private final UserRepo userRepository;

    @Autowired
    public ScoreController(ScoreRepo scoreRepository, UserRepo userRepository) {
        this.scoreRepository = scoreRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addScore(@RequestParam Long userId, @RequestBody Score score) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
        score.setUser(user.get());
        scoreRepository.save(score);
        return ResponseEntity.status(HttpStatus.CREATED).body("Score added successfully.");
    }

    @GetMapping("/all")
    public ResponseEntity<List<Score>> getAllScores() {
        List<Score> scores = scoreRepository.findAll();
        return ResponseEntity.ok(scores);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Score>> getScoresByUserId(@PathVariable Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        List<Score> scores = scoreRepository.findByUser(user.get());
        return ResponseEntity.ok(scores);
    }
}
