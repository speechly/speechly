package com.speechly.example

import android.os.Bundle
import android.view.MotionEvent
import android.view.View
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.speechly.client.slu.*
import com.speechly.client.speech.Client
import com.speechly.ui.SpeechlyButton
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.util.*

val repoList = listOf(
        Repo(1, "TYPESCRIPT", R.drawable.logo_typescript, "typescript", "microsoft", 2200, 68500, 9100),
        Repo(2, "TYPESCRIPT", R.drawable.logo_typescript, "nest", "nestjs", 669, 34500, 3200),
        Repo(3, "TYPESCRIPT", R.drawable.logo_typescript, "vscode", "microsoft", 3100, 111000, 18000),
        Repo(4, "TYPESCRIPT", R.drawable.logo_typescript, "deno", "denoland", 1700, 72400, 3800),
        Repo(5, "GO", R.drawable.logo_go, "kubernetes", "kubernetes", 3300, 74300, 26900),
        Repo(6, "GO", R.drawable.logo_go, "moby", "moby", 3200, 58600, 16900),
        Repo(7, "GO", R.drawable.logo_go, "hugo", "gohugoio", 1000, 47200, 5400),
        Repo(8, "GO", R.drawable.logo_go, "grafana", "grafana", 1200, 39800, 8100),
        Repo(9, "PYTHON", R.drawable.logo_python, "pytorch", "pytorch", 1600, 46100, 12300),
        Repo(10, "PYTHON", R.drawable.logo_python, "tensorflow", "tensorflow", 8200, 153000, 84000),
        Repo(11, "PYTHON", R.drawable.logo_python, "django", "django", 2300, 55500, 23800),
        Repo(12, "PYTHON", R.drawable.logo_python, "airflow", "apache", 734, 20400, 8000)
)

class MainActivity : AppCompatActivity() {

    private val speechlyClient: Client = Client.fromActivity(
            activity = this,
            appId = UUID.fromString("yourkey")
    )

    private var button: SpeechlyButton? = null
    private var textView: TextView? = null
    private var recyclerView: RecyclerView? = null
    private lateinit var repoAdapter: RepoRecyclerAdapter
    private var languageFilter: String? = null
    private var sortField: String? = null

    private var buttonTouchListener = object : View.OnTouchListener {
        override fun onTouch(v: View?, event: MotionEvent?): Boolean {
            when (event?.action) {
                MotionEvent.ACTION_DOWN -> {
                    textView?.visibility = View.VISIBLE
                    textView?.text = ""
                    speechlyClient.startContext()
                }
                MotionEvent.ACTION_UP -> {
                    speechlyClient.stopContext()
                    GlobalScope.launch(Dispatchers.Default) {
                        delay(500)
                        textView?.visibility = View.INVISIBLE
                    }
                }
            }
            return true
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        this.button = findViewById(R.id.speechly)
        this.recyclerView = findViewById(R.id.recycler_view)
        this.textView = findViewById(R.id.textView)
        textView?.visibility = View.INVISIBLE

        GlobalScope.launch(Dispatchers.Default) {
            speechlyClient.onSegmentChange { segment: Segment ->
                val transcript: String = segment.words.values.map{it.value}.joinToString(" ")

                GlobalScope.launch(Dispatchers.Main) {
                    textView?.setText("${transcript}")

                    if (segment.intent != null) {
                        when(segment.intent?.intent) {
                            "filter" -> {
                                languageFilter = segment.getEntityByType("language")?.value
                                updateList()
                            }
                            "sort" -> {
                                sortField = segment.getEntityByType("sort_field")?.value
                                updateList()
                            }
                            "reset" -> {
                                languageFilter = null
                                updateList()
                            }
                        }
                    }
                }
            }
        }

        button?.setOnTouchListener(buttonTouchListener)

        recyclerView?.apply {
            layoutManager = LinearLayoutManager(this@MainActivity)
            repoAdapter = RepoRecyclerAdapter()
            adapter = repoAdapter
        }
        updateList()
    }

    fun updateList() {
        val list = repoList.filter { repo: Repo ->
            languageFilter == null || repo.language == languageFilter
        }.sortedWith(Comparator { r1: Repo, r2: Repo ->
            when (sortField) {
                "NAME" -> if (r1.name > r2.name) 1 else -1
                "LANGUAGE" -> if (r1.language > r2.language) 1 else -1
                "FOLLOWERS" -> r2.followers - r1.followers
                "STARS" -> r2.stars - r1.stars
                "FORKS" -> r2.forks - r1.forks
                else -> (r1.id - r2.id).toInt()
            }
        })
        repoAdapter.submitList(list)
        repoAdapter.notifyDataSetChanged()
    }
}
