package com.Cows_and_Bulls_Game_api.Repo;

import com.Cows_and_Bulls_Game_api.Model.Score;
import com.Cows_and_Bulls_Game_api.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScoreRepo extends JpaRepository<Score, Long> {
    List<Score> findByUser(User user);
}
