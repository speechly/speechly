package com.speechly.example

data class Repo(
        val id: Long,
        val language: String,
        val iconId: Int,
        val name: String,
        val organisation: String,
        val followers: Int,
        val stars: Int,
        val forks: Int
)